var state;

function campGroundList(state) {
  $("#collapsibleBtn").empty();
  var queryURL = "https://developer.nps.gov/api/v1/campgrounds?stateCode=" + state + "&api_key=oJQ6w92mgUEXujnDd210oDOQAxHx51qHdA0sVcRL";
  console.log(state);

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    
    for (var i = 0; i < response.data.length; i++) {
      var campName = response.data[i].name;
      var campDescription = response.data[i].description;
      var campAmenities = response.data[i].amenities;
      var campSpots = response.data[i].campsites;
      var campFees = response.data[i].fees;
      var campEmail = response.data[i].contacts.emailAddresses;
      var campPhone = response.data[i].contacts.phoneNumbers;
      var campUrl = response.data[i].reservationUrl;
      var campAccessibility = response.data[i].accessibility;
      var campHours = response.data[i].operatingHours;

      console.log(response.data[i].name);
    
      $("#collapsibleBtn").append(
      `<li>
        <div class="collapsible-header"><i class="material-icons">place</i>${campName}</div>
        <div class="collapsible-body"><span>
          <p>${campDescription}</p>
          <hr>
          <p>Amenities: ${campAmenities}**</p>
          <hr>
          <p>Camp spots:${campSpots}**</p>
          <hr>
          <p>Fees:💲 ${campFees}**</p>
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