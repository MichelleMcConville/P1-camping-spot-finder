$(document).ready(function(){

  var stateCode = [];
  var stateHistory = "";
  
  loadState()
  
  // Getting states from local storage
  function loadState() {
    stateCode = JSON.parse(localStorage.getItem("ls-state"));
    console.log()
    if (stateCode) {
      stateData(stateCode[stateCode.length - 1])
    } else {
      stateCode = [];
    }
  }
  
  //Dynamically building State List under search box
  function stateSearchList() {
    $("#stateList").empty();
    var count = 0;
    for (var i = stateCode.length-1; i >= 0; i--) {
      if (count++ < 5) {
        var newBtn = $("<button>").attr("class", "listBtn btn stateBtn").attr("state-name", stateCode[i]).text(stateCode[i]);
        console.log(newBtn);
      $("#stateList").append(newBtn);
      }
    }
  }
  
  // Saving states to local storage
  function saveState() {
    console.log("saveState");
    localStorage.setItem("ls-state", JSON.stringify(stateCode));
  }
  
  // Loads state on refresh only add states if not in the list
  function stateData(stateHistory) {
    $("#addState").val("");
    if (stateCode.includes(stateHistory) === false) {
      stateCode.push(stateHistory);
      saveState();  
    }
      stateSearchList();
      var currentState = stateCode[stateCode.length-1];
      campGroundList(currentState);
  }
  
  // Listing out campgrounds
  function campGroundList(state) {
    $("#collapsibleBtn").empty();
    var queryURL = "https://developer.nps.gov/api/v1/campgrounds?stateCode=" + state + "&api_key=oJQ6w92mgUEXujnDd210oDOQAxHx51qHdA0sVcRL";
    console.log(state);
    console.log("https://developer.nps.gov/api/v1/campgrounds?stateCode=" + state + "&api_key=oJQ6w92mgUEXujnDd210oDOQAxHx51qHdA0sVcRL")
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      
      for (var i = 0; i < response.data.length; i++) {
        var campName = response.data[i].name;
        var parkCode = response.data[i].parkCode;
        var campDescription = response.data[i].description;
        var campAmenities = response.data[i].amenities;
        var campSpots = response.data[i].campsites.totalSites;
        var campFees = response.data[i].fees;
        // var campEmail = response.data[i].contacts.emailAddresses[0].emailAddress;
        var campEmail = response.data[i].contacts.emailAddresses.length > 0 ? (response.data[i].contacts.emailAddresses[0].emailAddress ? response.data[i].contacts.emailAddresses[0].emailAddress : "N/A") : "N/A";
        var campPhone = response.data[i].contacts.phoneNumbers;
        var campUrl = response.data[i].reservationUrl;
        var campAccessibility = response.data[i].accessibility;
        var campHours = response.data[i].operatingHours;
  
        console.log(response.data[i].name);
  
        $("#collapsibleBtn").append(
        `<li>
          <div class="collapsible-header"><i class="material-icons">place</i>${campName} (${parkCode})</div>
          <div class="collapsible-body"><span>
            <p>${campDescription}</p>
            <hr>
            <p>Total Camp Sites: ${campSpots}</p>
            <hr>
            <p>Fees:💲 ${campFees}**</p>
            <hr>
            <p>Amenities: ${campAmenities}**</p>
            <hr>
            <p>📧 ${campEmail}</p>
            <hr>
            <p>☎️ ${campPhone}</p>
            <hr>
            <p>Reservations: ${campUrl}</p>
            <hr>
            <p>Accessibility: ${campAccessibility}**</p>
            <hr>
            <p>Operating Hours: ${campHours}**</p>
          </span></div>
        </li>`
        )
      }
    });
  }
  
  // On click for search box
  $("#searchBtn").on("click", function(event) {
    event.preventDefault();
    $(".collapsible").empty();
    stateHistory = $("#addState").val().trim();
    if (stateHistory === "") {
      return;
    }
    stateData(stateHistory);
  });
  
  
  $(document).on("click", ".stateBtn", function(event) {
    event.preventDefault();
    selectedState = $(this).text().trim();
    campGroundList(selectedState);
  })
  
  $('.collapsible').collapsible();
  
  });