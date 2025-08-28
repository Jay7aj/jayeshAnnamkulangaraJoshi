
// function to load all personnel data
function loadPersonnel() {
  $.ajax({
    url: "library/php/getAll.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.code == "200") {
        let rows = "";

        $.each(result.data, function () {
          rows += `
            <tr>
              <td class="align-middle">${this.lastName} ${this.firstName}</td>
              <td class="align-middle d-none d-md-table-cell">${this.jobTitle}</td>
              <td class="align-middle d-none d-md-table-cell">${this.department}</td>
              <td class="align-middle d-none d-md-table-cell">${this.location}</td>
              <td class="align-middle d-none d-md-table-cell">${this.email}</td>
              <td class="text-end">
                <button type="button" class="btn btn-primary btn-sm"
                  data-bs-toggle="modal" 
                  data-bs-target="#editPersonnelModal" 
                  data-id="${this.id}">
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm " data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${this.id}">
                    <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
          `;
        });
        $("#personnelTableBody").html(rows);
      } else {
        alert("Error: " + result.status.description);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      alert("Could not load personnel.");
    }
  });
}

// function to load all departments data with location
function loadDepartment(){
  $.ajax({
    url:"library/php/getAllDeptLocation.php",
    type:"POST",
    dataType: "json",
    success:function(result){
      if(result.status.code == 200){
        let rows = "";

        $.each(result.data, function(){
          rows +=`
            <tr>
                <td class="align-middle text-nowrap">
                  ${this.department}
                </td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">
                  ${this.location}
                </td>
                <td class="align-middle text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm"
                    data-bs-toggle="modal" 
                    data-bs-target="#editDepartmentModal" 
                    data-id="${this.id}">
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button type="button" class="btn btn-danger btn-sm " data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="${this.id}">
                      <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
            </tr> 
          `;
        })
        $("#departmentTableBody").html(rows);
      }
    },error:function(xhr, status, error){
      console.error("AJAX Error:", status, error);
      alert("Could not load Departments");
    }
  })
}

// function to load all locations data
function loadLocations(){
  $.ajax({
    url:"library/php/getAllLocations.php",
    type:"POST",
    dataType: "json",
    success:function(result){
      if(result.status.code == 200){
        let rows = "";

        $.each(result.data, function(){
          rows +=`
            <tr>
                <td class="align-middle text-nowrap">
                  ${this.name}
                </td>
                <td class="align-middle text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm"
                    data-bs-toggle="modal" 
                    data-bs-target="#editLocationModal" 
                    data-id="${this.id}">
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button type="button" class="btn btn-danger btn-sm " data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${this.id}">
                      <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
            </tr>
          `;
        })
        $("#locationTableBody").html(rows);
      }
    },error:function(xhr, status, error){
      console.error("AJAX Error:", status, error);
      alert("Could not load Locations");
    }
  })
}

// handler to load data on page load
$(document).ready(()=>{
    loadPersonnel();
    loadDepartment();
    loadLocations();
})



// handler for search key
$("#searchInp").on("keyup", function () {
  
  let input=$(this).val().trim();

  $.ajax({
    url: "library/php/searchAll.php",
    type: "POST",
    dataType: "json",
    data: { txt: input },
    success: function (result) {

      if (result.status.code === "200") {
        let rows = "";

        $("#personnelTableBody").html("");

        if (result.data.found.length > 0) {

          $.each(result.data.found, function () {

            rows += `
              <tr>
              <td class="align-middle">${this.lastName} ${this.firstName}</td>
              <td class="align-middle d-none d-md-table-cell">${this.jobTitle}</td>
              <td class="align-middle d-none d-md-table-cell">${this.departmentName}</td>
              <td class="align-middle d-none d-md-table-cell">${this.locationName}</td>
              <td class="align-middle d-none d-md-table-cell">${this.email}</td>
              <td class="text-end">
                <button type="button" class="btn btn-primary btn-sm"
                  data-bs-toggle="modal" 
                  data-bs-target="#editPersonnelModal" 
                  data-id="${this.id}">
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm " data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${this.id}">
                    <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
            `;

          });

        } else {

          rows = `
            <tr>
              <td colspan="7" class="text-center">No results found</td>
            </tr>
          `;
        }

        $("#personnelTableBody").html(rows);

      } else {
        console.error("Search failed:", result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    }
  });
  
});

// handler for refresh button
$("#refreshBtn").click(function () {
  
  if ($("#personnelBtn").hasClass("active")) {
 
    loadPersonnel();
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
   
      loadDepartment();
      
    } else {
     
      loadLocations();
      
    }
    
  }
  
});


// filter Button
$("#filterBtn").click(function () {
  
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  $("#filterPersonnelModal").modal("show"); 

});

// handler to populate dropdown in filter modal
$("#filterPersonnelModal").on("show.bs.modal",(e)=>{
  let deptDropdown= $("#filterPersonnelDepartment");
  let locDropdown= $("#filterPersonnelLocation");

  deptDropdown.empty().append('<option value="">-- All Departments --</option>');
  locDropdown.empty().append('<option value="">-- All Locations --</option>');

  // populate department dropdown
  $.ajax({
    url:"library/php/getAllDepartments.php",
    type:"POST",
    dataType:"json",
    data:{},
    success: function(result){

      if(result.status.code == 200){

        $.each(result.data, function(){
          deptDropdown.append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

      }else{
        alert("Error: " + result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#filterPersonnelModal .modal-title").replaceWith(
        "Error loading Departments dropdown"
      );
    }
    
  });

  // populate location dropdown
  $.ajax({
    url:"library/php/getAllLocations.php",
    type:"POST",
    dataType:"json",
    data:{},
    success: function(result){

      if(result.status.code == 200){

        $.each(result.data, function(){
          locDropdown.append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

      }else{
        alert("Error: " + result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#filterPersonnelModal .modal-title").replaceWith(
        "Error loading Departments dropdown"
      );
    }
  });
})

// handler to filter personnel
$("#filterPersonnelForm").on("submit",(e)=>{
  e.preventDefault();

  let deptID = $("#filterPersonnelDepartment").val();
  let locID = $("#filterPersonnelLocation").val();

  $.ajax({
    url: "library/php/getPersonnelFiltered.php",
    type: "POST",
    dataType: "json",
    data: {
      departmentID: deptID,
      locationID: locID
    },
    success: function(result) {
      
      if (result.status.code == 200) {
        let rows = "";

        if(result.data.length > 0){
          $.each(result.data, function () {
          rows += `
            <tr>
              <td class="align-middle">${this.lastName} ${this.firstName}</td>
              <td class="align-middle d-none d-md-table-cell">${this.jobTitle}</td>
              <td class="align-middle d-none d-md-table-cell">${this.department}</td>
              <td class="align-middle d-none d-md-table-cell">${this.location}</td>
              <td class="align-middle d-none d-md-table-cell">${this.email}</td>
              <td class="text-end">
                <button type="button" class="btn btn-primary btn-sm"
                  data-bs-toggle="modal" 
                  data-bs-target="#editPersonnelModal" 
                  data-id="${this.id}">
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm " data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${this.id}">
                    <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
          `;
        });
        }else{

          rows = `
            <tr>
              <td colspan="7" class="text-center">No results found</td>
            </tr>
          `;

        }
        
        $("#personnelTableBody").html(rows);
        $("#filterPersonnelModal").modal("hide");
      } else {
        alert("Error: " + result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#filterPersonnelForm .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });

})


// add button
$("#addBtn").click(function () {
  
  if($("#personnelBtn").hasClass("active")) {

    $("#addPersonnelModal").modal("show");

  }else if ($("#departmentsBtn").hasClass("active")) {

    $("#addDepartmentModal").modal("show");

  }else {

    $("#addLocationModal").modal("show");
  }

});

//loading add personnel form on modal show
$("#addPersonnelModal").on("show.bs.modal",()=>{

  let deptDropdown= $("#addPersonnelDepartment")
  deptDropdown.empty().append('<option value="">-- All Departments --</option>');
  // populate department dropdown
  $.ajax({
    url:"library/php/getAllDepartments.php",
    type:"POST",
    dataType:"json",
    data:{},
    success: function(result){

      if(result.status.code == 200){

        $.each(result.data, function(){
          deptDropdown.append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

      }else{
        alert("Error: " + result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addPersonnelModal .modal-title").replaceWith(
        "Error loading Departments dropdown"
      );
    }
    
  });
})

// loading add department form on modal show
$("#addDepartmentModal").on("show.bs.modal", ()=>{
  let locDropdown = $("#addDepartmentLocation");
  locDropdown.empty().append('<option value="">-- All Locations --</option>');;

  $.ajax({
    url:"library/php/getAllLocations.php",
    type:"POST",
    dataType:"json",
    data:{},
    success: function(result){

      if(result.status.code == 200){

        $.each(result.data, function(){
          locDropdown.append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

      }else{
        alert("Error: " + result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addDepartmentModal .modal-title").replaceWith(
        "Error loading Departments dropdown"
      );
    }
  });

})

// event handler to shift modal focus 
$('#addPersonnelModal').on('hidden.bs.modal', function () {
  $('#addBtn').trigger('focus');
});
$('#addDepartmentModal').on('hidden.bs.modal', function () {
  $('#addBtn').trigger('focus');
});
$('#addLocationModal').on('hidden.bs.modal', function () {
  $('#addBtn').trigger('focus');
});

// handler to add personal details
$("#addPersonnelForm").on("submit",(e)=>{
  e.preventDefault();

  let firstName= $("#addPersonnelFirstName").val();
  let lastName= $("#addPersonnelLastName").val();
  let jobTitle= $("#addPersonnelJobTitle").val();
  let email= $("#addPersonnelEmail").val();
  let departmentID= $("#addPersonnelDepartment").val();

  $.ajax({
    url:"library/php/insertPersonnel.php",
    type:"POST",
    dataType:"json",
    data: {
      firstName: firstName,
      lastName: lastName,
      jobTitle: jobTitle,
      email: email,
      departmentID: departmentID
    },
    success: function(result){

      if(result.status.code == 200){
        alert("Personnel added Sucessfully");
        loadPersonnel();
        $("#addPersonnelModal").modal("hide");
      }else{
        alert("Error: "+ result.status.description);
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addPersonnelModal .modal-title").replaceWith(
        "Error adding personnel"
      );
    }
  });

});

// handler to add department details
$("#addDepartmentForm").on("submit",(e)=>{
  e.preventDefault();

  let department= $("#addDepartmentName").val();
  let locationID= $("#addDepartmentLocation").val();

  $.ajax({
    url:"library/php/insertDepartment.php",
    type:"POST",
    dataType:"json",
    data: {
      department: department,
      locationID: locationID,
    },
    success: function(result){

      if(result.status.code == 200){
        alert("Deapartment added Sucessfully");
        loadDepartment();
        $("#addDepartmentModal").modal("hide");
      }else{
        alert("Error: "+ result.status.description);
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addDepartmentModal .modal-title").replaceWith(
        "Error adding department"
      );
    }
  });

});

// handler to add location
$("#addLocationForm").on("submit",(e)=>{
  e.preventDefault();

  let location= $("#addLocationName").val();

  $.ajax({
    url:"library/php/insertLocation.php",
    type:"POST",
    dataType:"json",
    data: {location: location},
    success: function(result){

      if(result.status.code == 200){
        alert("Location added Sucessfully");
        loadLocations();
        $("#addLocationModal").modal("hide");
      }else{
        alert("Error: "+ result.status.description);
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addLocationModal .modal-title").replaceWith(
        "Error adding location"
      );
    }
  });

});




$("#personnelBtn").click(function () {
  
  // Call function to refresh personnel table

  loadPersonnel();
  
});

$("#departmentsBtn").click(function () {
  
  // Call function to refresh department table

  loadDepartment();
  
});

$("#locationsBtn").click(function () {
  
  // Call function to refresh location table
  
  loadLocations();
  
});



// Handler Groups to Delete Personnel Details
// handler to store id
$("#deletePersonnelModal").on("show.bs.modal",function (e){
  let id = $(e.relatedTarget).attr("data-id"); 
  $("#deletePersonnelID").val(id);
});

// handler for deleting
$("#deletePersonnelForm").on("submit",(e)=>{
  e.preventDefault();

  let id = $("#deletePersonnelID").val();

  $.ajax({
    url:"library/php/deletePersonnelByID.php",
    type: "POST",
    dataType: "json",
    data:{ id: id },
    success: function(result){

      if(result.status.code == 200){
  
        $("#deletePersonnelModal").modal("hide");
        loadPersonnel();
      }else{
        alert("Error: " + result.status.description);
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#DeletePersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

//handler to shift focus 
$('#deletePersonnelModal').on('hidden.bs.modal', function () {
  $('#personnelBtn').trigger('focus');
});



// Handler Groups to Delete Department Details
// handler to store id
$("#deleteDepartmentModal").on("show.bs.modal",function (e){
  let id = $(e.relatedTarget).attr("data-id"); 
  $("#deleteDepartmentID").val(id);
});

// handler for deleting 
$("#deleteDepartmentForm").on("submit",(e)=>{
  e.preventDefault();

  let id= $("#deleteDepartmentID").val();

  $.ajax({
    url:"library/php/deleteDepartmentByID.php",
    type:"POST",
    dataType:"json",
    data:{id: id},
    success: function(result){

      if(result.status.code == 409){
        alert("Cannot delete: Department still assigned to personnel");
        $("#deleteDepartmentModal").modal("hide");
      }
      else if(result.status.code == 200){

        $("#deleteDepartmentModal").modal("hide");
        loadDepartment();
      }else{
        alert("Error: " + result.status.description);
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

// handler to shift focus
$('#deleteDepartmentModal').on('hidden.bs.modal', function () {
  $('#departmentsBtn').trigger('focus');
});



// Handler Groups to Delete Location Details
// handler to store id
$("#deleteLocationModal").on("show.bs.modal",function (e){
  let id = $(e.relatedTarget).attr("data-id"); 
  $("#deleteLocationID").val(id);
});

// handler for deleting 
$("#deleteLocationForm").on("submit",(e)=>{
  e.preventDefault();

  let id= $("#deleteLocationID").val();

  $.ajax({
    url:"library/php/deleteLocationByID.php",
    type:"POST",
    dataType:"json",
    data:{id: id},
    success: function(result){

      if(result.status.code == 409){
        alert("Cannot delete: Location still assigned to department or personnel")
        $("#deleteLocationModal").modal("hide");
      }else if(result.status.code == 200){
        
        $("#deleteLocationModal").modal("hide");
        loadLocations();
      }else{
        alert("Error: " + result.status.description);
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteLocationModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

// handler to shift focus
$('#deleteLocationModal').on('hidden.bs.modal', function () {
  $('#locationsBtn').trigger('focus');
});



// handler to load edit personnel modal
$("#editPersonnelModal").on("show.bs.modal", function (e) {
  
  $.ajax({
    url:  "library/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id") 
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
        
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

// Executes when the form button with type="submit" is clicked
$("#editPersonnelForm").on("submit", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  $.ajax({
    url:"library/php/editPersonnelByID.php",
    type:"POST",
    dataType:"json",
    data:{
      persID: $("#editPersonnelEmployeeID").val(),
      firstName: $("#editPersonnelFirstName").val(),
      lastName: $("#editPersonnelLastName").val(),
      jobTitle: $("#editPersonnelJobTitle").val(),
      email: $("#editPersonnelEmailAddress").val(),
      deptID: $("#editPersonnelDepartment").val(),
     },
    success: function(result){

      if(result.status.code == 200){
        $("#editPersonnelModal").modal("hide");
        alert("Personnel details updated successfully");
        loadPersonnel();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error saving data"
      );
    }
  });
  
});

// handler to shift focus
$('#editPersonnelModal').on('hidden.bs.modal', function () {
  $('#personnelBtn').trigger('focus');
});



// handler to load modal for edit department
$("#editDepartmentModal").on("show.bs.modal", (e)=>{
  
  $.ajax({
    url:  "library/php/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id") 
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editDepartmentID").val(result.data.department[0].id);

        $("#editDepartmentName").val(result.data.department[0].name);

        $("#editDepartmentLocation").html("");

        $.each(result.data.location, function () {
          $("#editDepartmentLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );

        $("#editDepartmentLocation").val(result.data.department[0].locationID);
        
        });
        
      } else {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
})

// Executes when the edit department form button with type="submit" is clicked
$("#editDepartmentModal").on("submit",(e)=>{
  e.preventDefault();

  $.ajax({
    url:"library/php/editDepartmentByID.php",
    type:"POST",
    dataType:"json",
    data:{
      deptName: $("#editDepartmentName").val(),
      locationID: $("#editDepartmentLocation").val(),
      deptID: $("#editDepartmentID").val()
    },
    success: function(result){

      if(result.status.code == 200){
        $("#editDepartmentModal").modal("hide");
        alert("Department details updated successfully");
        loadDepartment();

      }else{
        $("#editDepartmentModal .modal-title").replaceWith(
        "Error saving data"
      );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editDepartmentModal .modal-title").replaceWith(
        "Error saving data"
      );
    }
  });
});

// handler to shift focus
$('#editDepartmentModal').on('hidden.bs.modal', function () {
  $('#departmentsBtn').trigger('focus');
});



// handler to load modal for edit location
$("#editLocationModal").on("show.bs.modal", (e)=>{
  
  $.ajax({
    url:  "library/php/getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id") 
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editLocationID").val(result.data[0].id);

        $("#editLocationName").val(result.data[0].name);
        
      } else {
        $("#editLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editLocationModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
})

// Executes when the edit department form button with type="submit" is clicked
$("#editLocationModal").on("submit",(e)=>{
  e.preventDefault();

  $.ajax({
    url:"library/php/editLocationByID.php",
    type:"POST",
    dataType:"json",
    data:{
      name: $("#editLocationName").val(),
      id: $("#editLocationID").val()
    },
    success: function(result){

      if(result.status.code == 200){
        $("#editLocationModal").modal("hide");
        alert("Location details updated successfully");
        loadLocations();
        
      }else{
        $("#editLocationModal .modal-title").replaceWith(
        "Error saving data"
      );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editLocationModal .modal-title").replaceWith(
        "Error saving data"
      );
    }
  });
});

// handler to shift focus
$('#editLocationModal').on('hidden.bs.modal', function () {
  $('#locationsBtn').trigger('focus');
});