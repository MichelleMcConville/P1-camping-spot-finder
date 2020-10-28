$(document).ready(function () {
  var apiMapKey = "&key=nFa7pptsOAwKeABy7NDpY1EQLzmtJmV0";
  var stateCode = [];
  var stateHistory = "";

  loadState();

  // Getting states from local storage
  function loadState() {
    stateCode = JSON.parse(localStorage.getItem("ls-state"));
    if (stateCode) {
      stateData(stateCode[stateCode.length - 1]);
    } else {
      stateCode = [];
    }
  }

  // Loads state on refresh only add states if not in the list
  function stateData(stateHistory) {
    $("#addState").val("");
    if (stateCode.includes(stateHistory) === false) {
      stateCode.push(stateHistory);
      saveState();
    }
    stateSearchList();
    var currentState = stateCode[stateCode.length - 1];
    campGroundList(currentState);
  }

  //Dynamically building State List under search box
  function stateSearchList() {
    $("#stateList").empty();
    var count = 0;
    for (var i = stateCode.length - 1; i >= 0; i--) {
      if (count++ < 5) {
        var newBtn = $("<button>").attr("class", "listBtn btn stateBtn").attr("state-name", stateCode[i]).text(stateCode[i]);
        $("#stateList").append(newBtn);
      }
    }
  }

  // Saving states to local storage
  function saveState() {
    localStorage.setItem("ls-state", JSON.stringify(stateCode));
  }

  // Listing out campground information in main section
  function campGroundList(state) {
    $("#collapsibleBtn").empty();
    var baseURL = "https://developer.nps.gov/api/v1/campgrounds?stateCode=";
    var apiKey = "&api_key=oJQ6w92mgUEXujnDd210oDOQAxHx51qHdA0sVcRL";
    var queryURL = baseURL + state + apiKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      for (var i = 0; i < response.data.length; i++) {
        var park = response.data[i];
        var campName = park.name;
        console.log(campName);
        var campNameNoSpaces = campName.split(" ").join("");
        var parkCode = park.parkCode;
        var lat = park.latitude;
        console.log(lat);
        var lng = park.longitude;
        console.log(lng);
        var campDescription = park.description;
        var campSpots = park.campsites.totalSites;
        var firstCome = park.campsites.numberOfSitesFirstComeFirstServe;
        var reservable = park.campsites.numberOfSitesReservable;
        var electricHookUps = park.campsites.electricalHookups;
        var group = park.campsites.group;
        var horse = park.campsites.horse;
        var other = park.campsites.other;
        var rvOnly = park.campsites.rvOnly;
        var tentOnly = park.campsites.tentOnly;
        var boat = park.campsites.walkToBoat;
        var campEmail = park.contacts.emailAddresses.length > 0 ? (park.contacts.emailAddresses[0].emailAddress ? park.contacts.emailAddresses[0].emailAddress : "N/A") : "N/A";
        var campPhone = park.contacts.phoneNumbers.length > 0 ? (park.contacts.phoneNumbers[0].phoneNumber ? park.contacts.phoneNumbers[0].phoneNumber : "N/A") : "N/A";
        var campUrl = park.url.length > 0 ? (park.url ? park.url : "N/A") : "N/A";
        var campOPHours = park.operatingHours.length;
        var campHoursSun = "";
        var campHoursMon = "";
        var campHoursTue = "";
        var campHoursWed = "";
        var campHoursThu = "";
        var campHoursFri = "";
        var campHoursSat = "";
        if (campOPHours > 0) {
          campHoursSun = park.operatingHours[0].standardHours.sunday;
          campHoursMon = park.operatingHours[0].standardHours.monday;
          campHoursTue = park.operatingHours[0].standardHours.tuesday;
          campHoursWed = park.operatingHours[0].standardHours.wednesday;
          campHoursThu = park.operatingHours[0].standardHours.thursday;
          campHoursFri = park.operatingHours[0].standardHours.friday;
          campHoursSat = park.operatingHours[0].standardHours.saturday;
        } else {
          campHoursSun = "N/A";
          campHoursMon = "N/A";
          campHoursTue = "N/A";
          campHoursWed = "N/A";
          campHoursThu = "N/A";
          campHoursFri = "N/A";
          campHoursSat = "N/A";
        }

        $("#collapsibleBtn").append(
          `<li>
          <div id="camp-name" class="collapsible-header"><i class="material-icons">place</i>${campName} (${parkCode})</div>
          <div class="collapsible-body"><span>
            <p id="camp-desc">${campDescription}</p><hr>
            <p id="total-sites">Total Camp Sites: ${campSpots}</p><br>
            <p id="first-come">1st Come 1st Serve: ${firstCome}</p>
            <p id="reserve">Reservable: ${reservable}</p>
            <p id="electrical">Electrical Hookups: ${electricHookUps}</p>
            <p id="group">Group: ${group}</p>
            <p id="horse">Horse: ${horse}</p>
            <p id="other">Other: ${other}</p>
            <p id="rv">RV Only: ${rvOnly}</p>
            <p id="tent">Tent Only: ${tentOnly}</p>
            <p id="boat">Walk to Boat: ${boat}</p><hr>
            <p id=${campNameNoSpaces} class="camp-fees">💲 Fees:</p><br>
            <p id="camp-email">📧 ${campEmail}</p><hr>
            <p id="camp-phone">☎️ ${campPhone}</p><hr>
            <p id="website">Website: ${campUrl}</p><hr>
            <p id="camp-hours">Operating Hours:</p><br>
            <p>Sunday: ${campHoursSun}</p>
            <p>Monday: ${campHoursMon}</p>
            <p>Tuesday: ${campHoursTue}</p>
            <p>Wednesday: ${campHoursWed}</p>
            <p>Thursday: ${campHoursThu}</p>
            <p>Friday: ${campHoursFri}</p>
            <p>Saturday: ${campHoursSat}</p><br>
            <button id="mapBtn" class="btn" lat="${lat}" lng="${lng}" type="submit">Open Map</button>
          </span></div>
        </li>`
        );
        renderFees(park, campNameNoSpaces);
      }
    });
  }

  function renderMap(latLong) {
    //if (lat !== null && lng !== null) {
    var map = tt.map({
      key: apiMapKey,
      container: "map-div",
      center: latLong,
      zoom: 12,
    });
    //}
  }

  // To list out fees for each campsite
  function renderFees(park, campNameNoSpaces) {
    var campFees = park.fees.length;

    if (campFees > 0) {
      for (var j = 0; j < park.fees.length; j++) {
        var feeCost = $("<p>")
          .attr("id", "fees-cost")
          .text("Cost: " + park.fees[j].cost);
        var feeTitle = $("<p>")
          .attr("id", "fees-title")
          .text("Title: " + park.fees[j].title);
        var feeDesc = $("<p>")
          .attr("id", "fees-desc")
          .text("Desc: " + park.fees[j].description);
        $("#" + campNameNoSpaces).append(feeCost, feeTitle, feeDesc);
      }
    }
  }

  // On click for search box in lev nav
  $("#searchBtn").on("click", function(event) {
    event.preventDefault();
    $(".collapsible").empty();
    stateHistory = $("#addState").val().trim();
    if (stateHistory === "") {
      return;
    }
    stateData(stateHistory);
  });

  // On click for state buttons in left nav
  $(document).on("click", ".stateBtn", function(event) {
    event.preventDefault();
    selectedState = $(this).text().trim();
    campGroundList(selectedState);
  });

  $(document).on("click", "#mapBtn", function(event) {
    event.preventDefault();
    var lat = parseFloat($(this).attr("lat"));
    var lng = parseFloat($(this).attr("lng"));
    var latLong = {
      lat: lat,
      lng: lng,
    };

    if (lat !== NaN && lng !== NaN) {
      //mapBtn.classList.remove("hide");
      renderMap(latLong);
    }
  });

  // Making camp buttons expand & collapse in main section
  $(".collapsible").collapsible();
});