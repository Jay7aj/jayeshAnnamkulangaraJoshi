
// function to load all personnel data
function loadPersonnel() {

  document.getElementById("searchInp").value = "";

  $.ajax({
    url: "library/php/getAll.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.code == "200") {

        const personnelTable = document.getElementById("personnelTableBody");
        personnelTable.innerHTML = "";

        const frag = document.createDocumentFragment();

        $.each(result.data, function () {

          let row = document.createElement("tr");

          let nameCell = document.createElement("td");
          nameCell.classList.add("align-middle", "text-nowrap");
          nameCell.textContent = `${this.lastName}, ${this.firstName}`;
          row.append(nameCell);

          let titleCell = document.createElement("td");
          titleCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
          titleCell.textContent = this.jobTitle;
          row.append(titleCell);

          let departmentCell = document.createElement("td");
          departmentCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
          departmentCell.textContent = this.department;
          row.append(departmentCell);

          let locationCell = document.createElement("td");
          locationCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
          locationCell.textContent = this.location;
          row.append(locationCell);

          let emailCell = document.createElement("td");
          emailCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
          emailCell.textContent = this.email;
          row.append(emailCell);

          let actionCell = document.createElement("td");
          actionCell.classList.add("text-end", "text-nowrap");

          const editButtn = document.createElement("button");
          editButtn.type = "button";
          editButtn.className = "btn btn-primary btn-sm";
          editButtn.setAttribute("data-bs-toggle", "modal");
          editButtn.setAttribute("data-bs-target", "#editPersonnelModal");
          editButtn.setAttribute("data-id", this.id);
          editButtn.innerHTML= '<i class="fa-solid fa-pencil"></i>';

          const deleteBttn = document.createElement("button");
          deleteBttn.type = "button";
          deleteBttn.className = "btn btn-primary btn-sm";
          deleteBttn.setAttribute("data-bs-toggle", "modal");
          deleteBttn.setAttribute("data-bs-target", "#deletePersonnelModal");
          deleteBttn.setAttribute("data-id", this.id);
          deleteBttn.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

          actionCell.append(editButtn, " ", deleteBttn);
          row.append(actionCell);

          frag.append(row);

        });

        personnelTable.append(frag);

      } else {

        let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
        document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
        document.getElementById("messageModalMessage").innerHTML = "Error: "+ result.status.description;
        messageModal.show();
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
      document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
      document.getElementById("messageModalMessage").innerHTML = "Could not load personnel data" ;
      messageModal.show();
      
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
        
        const departmentTable = document.getElementById("departmentTableBody");

        departmentTable.innerHTML= "";

        const frag = document.createDocumentFragment();
        

        $.each(result.data, function(){

          let row = document.createElement("tr");

          let deprtCell = document.createElement("td");
          deprtCell.className = "align-middle text-nowrap";
          deprtCell.textContent = this.department;
          row.append(deprtCell);
          
          let locCell = document.createElement("td");
          locCell.className = "align-middle text-nowrap d-none d-md-table-cell";
          locCell.textContent = this.location;
          row.append(locCell);

          let actionCell = document.createElement("td");
          actionCell.className = "align-middle text-end text-nowrap";

          let editButtn = document.createElement("button");
          editButtn.type = "button";
          editButtn.className = "btn btn-primary btn-sm";
          editButtn.setAttribute("data-bs-toggle", "modal");
          editButtn.setAttribute("data-bs-target", "#editDepartmentModal");
          editButtn.setAttribute("data-id", this.id);
          editButtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

          let deleteButtn = document.createElement("button");
          deleteButtn.type = "button";
          deleteButtn.className = "btn btn-primary btn-sm";
          deleteButtn.setAttribute("data-bs-toggle", "modal");
          deleteButtn.setAttribute("data-bs-target", "#deleteDepartmentModal");
          deleteButtn.setAttribute("data-id", this.id);
          deleteButtn.innerHTML = `<i class="fa-solid fa-trash fa-fw"></i>`;

          actionCell.append(editButtn," ", deleteButtn);
          row.append(actionCell);

          frag.append(row);

        })
        
        departmentTable.append(frag);
        
      }else{
        let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
        document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
        document.getElementById("messageModalMessage").innerHTML = "Error: "+ result.status.description;
        messageModal.show();
      }
    },error:function(xhr, status, error){
      console.error("AJAX Error:", status, error);
      let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
      document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
      document.getElementById("messageModalMessage").innerHTML = "Could not load departments." ;
      messageModal.show();
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
        
        const locationTable = document.getElementById("locationTableBody");
        locationTable.innerHTML = "";

        const frag = document.createDocumentFragment();

        $.each(result.data, function(){

          let row = document.createElement("tr");

          let locCell = document.createElement("td");
          locCell.className = "align-middle text-nowrap";
          locCell.textContent = this.name;
          row.append(locCell);

          let actionCell = document.createElement("td");
          actionCell.className = "align-middle text-end text-nowrap";

          let editButtn = document.createElement("button");
          editButtn.type = "button";
          editButtn.className = "btn btn-primary btn-sm";
          editButtn.setAttribute("data-bs-toggle", "modal");
          editButtn.setAttribute("data-bs-target", "#editLocationModal");
          editButtn.setAttribute("data-id", this.id);
          editButtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

          let deleteButtn = document.createElement("button");
          deleteButtn.type = "button";
          deleteButtn.className = "btn btn-primary btn-sm";
          deleteButtn.setAttribute("data-bs-toggle", "modal");
          deleteButtn.setAttribute("data-bs-target", "#deleteLocationModal");
          deleteButtn.setAttribute("data-id", this.id);
          deleteButtn.innerHTML = `<i class="fa-solid fa-trash fa-fw"></i>`

          actionCell.append(editButtn, " ", deleteButtn);
          row.append(actionCell);

          frag.append(row);

        })
        
        locationTable.append(frag);

      }else{
        let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
        document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
        document.getElementById("messageModalMessage").innerHTML = "Error: "+ result.status.description;
        messageModal.show();
      }
    },error:function(xhr, status, error){
      console.error("AJAX Error:", status, error);
      let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
      document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
      document.getElementById("messageModalMessage").innerHTML = "Could not load locations." ;
      messageModal.show();
    }
  })
}

function updateFilterBtn(){
  let filterIcon = document.getElementById("filterBtn");

  if ($("#personnelBtn").hasClass("active")) {
 
    filterIcon.disabled = false;
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
   
      filterIcon.disabled = true;
    } else {
     
      filterIcon.disabled = true;
    }
    
  }
  
}

function updateSearchBar(){

  let searchBar = document.getElementById("searchInp");

  if ($("#personnelBtn").hasClass("active")) {
 
    searchBar.disabled = false;
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
   
      searchBar.disabled = true;
    } else {
     
      searchBar.disabled = true;
    }
    
  }
}

function toogleFilterBtnActive(){
  if((deptID !== "") || (locID !== "")){
    document.getElementById("filterBtn").classList.add("active");
  }else{
    document.getElementById("filterBtn").classList.remove("active");
  }
}

// handler to load data on page load
$(document).ready(()=>{
    loadPersonnel();
    loadDepartment();
    loadLocations();
   
})



// handler for search key
$("#searchInp").on("keyup", function () {
  deptID="";
  locID="";
  toogleFilterBtnActive();
  updateFilterBtn();
  

  let input=$(this).val().trim();

  $.ajax({
    url: "library/php/searchAll.php",
    type: "POST",

    dataType: "json",
    data: { txt: input },
    success: function (result) {

      if (result.status.code === "200") {

        if ($("#personnelBtn").hasClass("active")) {
 
          const personnelTable = document.getElementById("personnelTableBody");
          personnelTable.innerHTML = "";

          const frag = document.createDocumentFragment();

          if (result.data.found.length > 0) {

            
            $.each(result.data.found, function () {

              let row = document.createElement("tr");

              let nameCell = document.createElement("td");
              nameCell.classList.add("align-middle", "text-nowrap");
              nameCell.textContent = `${this.lastName}, ${this.firstName}`;
              row.append(nameCell);

              let titleCell = document.createElement("td");
              titleCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
              titleCell.textContent = this.jobTitle;
              row.append(titleCell);

              let departmentCell = document.createElement("td");
              departmentCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
              departmentCell.textContent = this.departmentName;
              row.append(departmentCell);

              let locationCell = document.createElement("td");
              locationCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
              locationCell.textContent = this.locationName;
              row.append(locationCell);

              let emailCell = document.createElement("td");
              emailCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
              emailCell.textContent = this.email;
              row.append(emailCell);

              let actionCell = document.createElement("td");
              actionCell.classList.add("text-end", "text-nowrap");

              const editButtn = document.createElement("button");
              editButtn.type = "button";
              editButtn.className = "btn btn-primary btn-sm";
              editButtn.setAttribute("data-bs-toggle", "modal");
              editButtn.setAttribute("data-bs-target", "#editPersonnelModal");
              editButtn.setAttribute("data-id", this.id);
              editButtn.innerHTML= '<i class="fa-solid fa-pencil"></i>';

              const deleteBttn = document.createElement("button");
              deleteBttn.type = "button";
              deleteBttn.className = "btn btn-primary btn-sm";
              deleteBttn.setAttribute("data-bs-toggle", "modal");
              deleteBttn.setAttribute("data-bs-target", "#deletePersonnelModal");
              deleteBttn.setAttribute("data-id", this.id);
              deleteBttn.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

              actionCell.append(editButtn, " ", deleteBttn);
              row.append(actionCell);

              frag.append(row);

            });
            
          } else {

            let row = document.createElement("tr");
            let notFoundCell = document.createElement("td");
            notFoundCell.setAttribute("colspan", "7");
            notFoundCell.className = "text-center";
            notFoundCell.textContent = "No results found";

            row.append(notFoundCell);
            frag.append(row);

          }

          personnelTable.append(frag);
          
        }

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
    deptID="";
    locID="";
    toogleFilterBtnActive();
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
   
      loadDepartment();
      
    } else {
     
      loadLocations();
      
    }
    
  }

  updateFilterBtn();
  
});

$("#personnelBtn").click(function () {
  
  // Call function to refresh personnel table

  if (deptID !== "") {
    document.getElementById("filterPersonnelDepartment").dispatchEvent(new Event("change"));

  } else if (locID !== "") {
    document.getElementById("filterPersonnelLocation").dispatchEvent(new Event("change"));

  } else if(document.getElementById("searchInp").value){
    document.getElementById("searchInp").dispatchEvent(new Event("keyup"));
  }else{
    loadPersonnel();
  }
  
  updateSearchBar();
  updateFilterBtn();
});

$("#departmentsBtn").click(function () {
  
  // Call function to refresh department table

  loadDepartment();
  updateSearchBar();
  updateFilterBtn();
});

$("#locationsBtn").click(function () {
  
  // Call function to refresh location table
  
  loadLocations();
  updateSearchBar();
  updateFilterBtn();
});




// filter Button

let deptID ="";
let locID="";
$("#filterBtn").click(function () {
  
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  $("#filterPersonnelModal").modal("show"); 

});

// handler to populate dropdown in filter modal
$("#filterPersonnelModal").on("show.bs.modal",(e)=>{


  let deptDropdown= $("#filterPersonnelDepartment");
  let locDropdown= $("#filterPersonnelLocation");

  deptDropdown.empty().append('<option value="">-- All --</option>');
  locDropdown.empty().append('<option value="">-- All --</option>');

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

        deptDropdown.val(deptID);

      }else{
        
        $("#filterPersonnelModal .modal-title").replaceWith(
        "Error: " + result.status.description
      );
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

        locDropdown.val(locID);
      }else{
        
        $("#filterPersonnelModal .modal-title").replaceWith(
        "Error: " + result.status.description
      );
      }


    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#filterPersonnelModal .modal-title").replaceWith(
        "Error loading Departments dropdown"
      );
    }
  });

})

$("#filterPersonnelDepartment").on("change",(e)=>{

  document.getElementById("searchInp").value = "";

  deptID = $("#filterPersonnelDepartment").val();
  $("#filterPersonnelLocation").val("");
  locID="";

  $.ajax({
    url: "library/php/getPersonnelFilteredByDeprt.php",
    type: "POST",
    dataType: "json",
    data: {
      departmentID: deptID
    },
    success: function(result) {

      if (result.status.code == 200) {
        
        const personnelTable = document.getElementById("personnelTableBody");
        personnelTable.innerHTML = "";

        const frag = document.createDocumentFragment();

        if(result.data.length > 0){

          $.each(result.data, function () {

            let row = document.createElement("tr");

            let nameCell = document.createElement("td");
            nameCell.classList.add("align-middle", "text-nowrap");
            nameCell.textContent = `${this.lastName}, ${this.firstName}`;
            row.append(nameCell);

            let titleCell = document.createElement("td");
            titleCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
            titleCell.textContent = this.jobTitle;
            row.append(titleCell);

            let departmentCell = document.createElement("td");
            departmentCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
            departmentCell.textContent = this.department;
            row.append(departmentCell);

            let locationCell = document.createElement("td");
            locationCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
            locationCell.textContent = this.location;
            row.append(locationCell);

            let emailCell = document.createElement("td");
            emailCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
            emailCell.textContent = this.email;
            row.append(emailCell);

            let actionCell = document.createElement("td");
            actionCell.classList.add("text-end", "text-nowrap");

            const editButtn = document.createElement("button");
            editButtn.type = "button";
            editButtn.className = "btn btn-primary btn-sm";
            editButtn.setAttribute("data-bs-toggle", "modal");
            editButtn.setAttribute("data-bs-target", "#editPersonnelModal");
            editButtn.setAttribute("data-id", this.id);
            editButtn.innerHTML= '<i class="fa-solid fa-pencil"></i>';

            const deleteBttn = document.createElement("button");
            deleteBttn.type = "button";
            deleteBttn.className = "btn btn-primary btn-sm";
            deleteBttn.setAttribute("data-bs-toggle", "modal");
            deleteBttn.setAttribute("data-bs-target", "#deletePersonnelModal");
            deleteBttn.setAttribute("data-id", this.id);
            deleteBttn.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

            actionCell.append(editButtn, " ", deleteBttn);
            row.append(actionCell);

            frag.append(row);
          });

        }else{

          let row = document.createElement("tr");
          let notFoundCell = document.createElement("td");
          notFoundCell.setAttribute("colspan", "7");
          notFoundCell.className = "text-center";
          notFoundCell.textContent = "No results found";

          row.append(notFoundCell);
          frag.append(row);

        }
        
        personnelTable.append(frag);

      } else {
        
        $("#filterPersonnelForm .modal-title").replaceWith(
        "Error: " + result.status.description
      );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#filterPersonnelForm .modal-title").replaceWith(
        "Error retrieving data"
      );
    }

  });
  
});

$("#filterPersonnelLocation").on("change",(e)=>{

  document.getElementById("searchInp").value = "";

  locID = $("#filterPersonnelLocation").val();
  $("#filterPersonnelDepartment").val("");
  deptID="";

  $.ajax({
    url: "library/php/getPersonnelFilteredByLoc.php",
    type: "POST",
    dataType: "json",
    data: {
      locationID: locID
    },
    success: function(result) {

      if (result.status.code == 200) {
        
        const personnelTable = document.getElementById("personnelTableBody");
        personnelTable.innerHTML = "";

        const frag = document.createDocumentFragment();

        if(result.data.length > 0){

          $.each(result.data, function () {

            let row = document.createElement("tr");

            let nameCell = document.createElement("td");
            nameCell.classList.add("align-middle", "text-nowrap");
            nameCell.textContent = `${this.lastName}, ${this.firstName}`;
            row.append(nameCell);

            let titleCell = document.createElement("td");
            titleCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
            titleCell.textContent = this.jobTitle;
            row.append(titleCell);

            let departmentCell = document.createElement("td");
            departmentCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
            departmentCell.textContent = this.department;
            row.append(departmentCell);

            let locationCell = document.createElement("td");
            locationCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
            locationCell.textContent = this.location;
            row.append(locationCell);

            let emailCell = document.createElement("td");
            emailCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell");
            emailCell.textContent = this.email;
            row.append(emailCell);

            let actionCell = document.createElement("td");
            actionCell.classList.add("text-end", "text-nowrap");

            const editButtn = document.createElement("button");
            editButtn.type = "button";
            editButtn.className = "btn btn-primary btn-sm";
            editButtn.setAttribute("data-bs-toggle", "modal");
            editButtn.setAttribute("data-bs-target", "#editPersonnelModal");
            editButtn.setAttribute("data-id", this.id);
            editButtn.innerHTML= '<i class="fa-solid fa-pencil"></i>';

            const deleteBttn = document.createElement("button");
            deleteBttn.type = "button";
            deleteBttn.className = "btn btn-primary btn-sm";
            deleteBttn.setAttribute("data-bs-toggle", "modal");
            deleteBttn.setAttribute("data-bs-target", "#deletePersonnelModal");
            deleteBttn.setAttribute("data-id", this.id);
            deleteBttn.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

            actionCell.append(editButtn, " ", deleteBttn);
            row.append(actionCell);

            frag.append(row);
          });

        }else{

          let row = document.createElement("tr");
          let notFoundCell = document.createElement("td");
          notFoundCell.setAttribute("colspan", "7");
          notFoundCell.className = "text-center";
          notFoundCell.textContent = "No results found";

          row.append(notFoundCell);
          frag.append(row);

        }
        
        personnelTable.append(frag);

      } else {
        
        $("#filterPersonnelForm .modal-title").replaceWith(
        "Error: " + result.status.description
      );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#filterPersonnelForm .modal-title").replaceWith(
        "Error retrieving data"
      );
    }

  });

});

$("#filterPersonnelModal").on("hide.bs.modal", ()=>{

  toogleFilterBtnActive();
  
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
        $("#addPersonnelModal .modal-title").replaceWith(
        "Error: " + result.status.description
      );
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
        $("#addDepartmentModal .modal-title").replaceWith("Error: " + result.status.description);
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

        loadPersonnel();
        $("#addPersonnelModal").modal("hide");

      }else{

        $("#addPersonnelModal").modal("hide");

        let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
        document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
        document.getElementById("messageModalMessage").innerHTML = "Error: "+ result.status.description;
        messageModal.show();

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

        loadDepartment();
        $("#addDepartmentModal").modal("hide");

      }else{

        $("#addDepartmentModal").modal("hide");

        let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
        document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
        document.getElementById("messageModalMessage").innerHTML = "Error: "+ result.status.description;
        messageModal.show();
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

        loadLocations();
        $("#addLocationModal").modal("hide");

      }else{

        $("#addLocationModal").modal("hide");

        let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
        document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
        document.getElementById("messageModalMessage").innerHTML = "Error: "+ result.status.description;

        messageModal.show();

      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addLocationModal .modal-title").replaceWith(
        "Error adding location"
      );
    }
  });

});



// Handler Groups to Delete Personnel Details
// handler to store id
$("#deletePersonnelModal").on("show.bs.modal",function (e){
  let id = $(e.relatedTarget).attr("data-id"); 
  let modalMessage = document.getElementById("deletePersonnelModalMessage");

  $.ajax({
    url:"library/php/getPersonnelByID.php",
    type:"post",
    dataType: "json",
    data: {id:id},
    success: function(result){
      if(result.status.code == 200){
        document.querySelector("#deletePersonnelModal .modal-title").textContent = "Delete Employ Entry";
        let name = `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`;
        modalMessage.innerHTML = `<p>Are you sure to remove the entry for <strong>${name}</strong></p>`;
        document.getElementById("delPersConfirm").classList.remove("d-none");
        document.getElementById("delPersReject").classList.remove("d-none");
        document.getElementById("delPersClose").classList.add("d-none");
        $("#deletePersonnelID").val(id);


      }else{
        document.querySelector("#deletePersonnelModal .modal-title").textContent = "ERROR:";
        modalMessage.innerHTML = "<p>Error retreiving data</p>";
        document.getElementById("delPersConfirm").classList.add("d-none");
        document.getElementById("delPersReject").classList.add("d-none");
        document.getElementById("delPersClose").classList.remove("d-none");

      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      document.querySelector("#deletePersonnelModal .modal-title").textContent = "ERROR:";
      modalMessage.innerHTML = "<p>Error retreiving data</p>";
      document.getElementById("delPersConfirm").classList.add("d-none");
      document.getElementById("delPersReject").classList.add("d-none");
      document.getElementById("delPersClose").classList.remove("d-none");
    }
  });

  
});

// handler for deleting
$("#deletePersonnelForm").on("submit",(e)=>{
  e.preventDefault();

  let id = $("#deletePersonnelID").val();
  let modalMessage = document.getElementById("deletePersonnelModalMessage");

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

        $("#deletePersonnelModal").modal("hide");

        let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
        document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
        document.getElementById("messageModalMessage").innerHTML = "Error deleting personnel data: "+ result.status.description;
        messageModal.show();
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deletePersonnelModal").modal("hide");

      let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
      document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
      document.getElementById("messageModalMessage").innerHTML = "Error deleting personnel data.";
      messageModal.show();
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
  let modalMessage = document.getElementById("deleteDepartmentModalMessage");

  $.ajax({
    url: "library/php/getDepartmentEntryCountByID.php",
    type: "post",
    dataType: "json",
    data: {id:id},
    success: function(result){

      if(result.status.code == 200){
        if(result.data.count > 0){
          document.querySelector("#deleteDepartmentModal .modal-title").textContent = "Cannot Delete Department...";
          modalMessage.innerHTML = `<p>Cannot delete <strong>${result.data.department[0].name}</strong> as it has <strong>${result.data.count}</strong> entries in personnel table.</p>`;
          document.getElementById("delDeprtConfirm").classList.add("d-none");
          document.getElementById("delDeprtReject").classList.add("d-none");
          document.getElementById("delDeprtClose").classList.remove("d-none");
        }else{
          document.querySelector("#deleteDepartmentModal .modal-title").textContent = "Delete Department";
          modalMessage.innerHTML = `<p>Are you sure to remove the entry for <strong>${result.data.department[0].name}</strong></p>`;
          document.getElementById("delDeprtConfirm").classList.remove("d-none");
          document.getElementById("delDeprtReject").classList.remove("d-none");
          document.getElementById("delDeprtClose").classList.add("d-none");
          $("#deleteDepartmentID").val(id);
        }
      }else{
        document.querySelector("#deleteDepartmentModal .modal-title").textContent = "ERROR:";
        modalMessage.innerHTML = "<p>Error retreiving data!</p>";
        document.getElementById("delDeprtConfirm").classList.add("d-none");
        document.getElementById("delDeprtReject").classList.add("d-none");
        document.getElementById("delDeprtClose").classList.remove("d-none");
      }

    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      document.querySelector("#deleteDepartmentModal .modal-title").textContent = "ERROR:";
      modalMessage.innerHTML = "<p>Error retreiving data!</p>";
      document.getElementById("delDeprtConfirm").classList.add("d-none");
      document.getElementById("delDeprtReject").classList.add("d-none");
      document.getElementById("delDeprtClose").classList.remove("d-none");
    }
  });

});

// handler for deleting 
$("#deleteDepartmentForm").on("submit",(e)=>{
  e.preventDefault();

  let id= $("#deleteDepartmentID").val();
  let modalMessage = document.getElementById("deleteDepartmentModalMessage");
  
  $.ajax({
    url:"library/php/deleteDepartmentByID.php",
    type:"POST",
    dataType:"json",
    data:{id: id},
    success: function(result){

      if(result.status.code == 200){

        $("#deleteDepartmentModal").modal("hide");
        loadDepartment();
      }else{

        let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
        document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
        document.getElementById("messageModalMessage").innerHTML = "Error deleting department data: "+ result.status.description;
        messageModal.show();
      }

    },
    error: function (jqXHR, textStatus, error) {
      console.error("AJAX Error:", textStatus, error);
      let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
        document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
        document.getElementById("messageModalMessage").innerHTML = "Error deleting department data!";
        messageModal.show();
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
  let modalMessage = document.getElementById("deleteLocationModalMessage");

  $.ajax({
    url: "library/php/getLocationEntryCountByID.php",
    type: "post",
    dataType: "json",
    data: {id:id},
    success: function(result){

      if(result.status.code == 200){
        if(result.data.count > 0){
          document.querySelector("#deleteLocationModal .modal-title").textContent = "Cannot Delete Location...";
          modalMessage.innerHTML = `<p>Cannot delete <strong>${result.data.location[0].name}</strong> as it has <strong>${result.data.count}</strong> entries in department table.</p>`;
          document.getElementById("delLocConfirm").classList.add("d-none");
          document.getElementById("delLocReject").classList.add("d-none");
          document.getElementById("delLocClose").classList.remove("d-none");
        }else{
          document.querySelector("#deleteLocationModal .modal-title").textContent = "Delete Location";
          modalMessage.innerHTML = `<p>Are you sure to remove the entry for <strong>${result.data.location[0].name}</strong></p>`;
          document.getElementById("delLocConfirm").classList.remove("d-none");
          document.getElementById("delLocReject").classList.remove("d-none");
          document.getElementById("delLocClose").classList.add("d-none");
          $("#deleteLocationID").val(id);
        }
      }else{
        document.querySelector("#deleteLocationModal .modal-title").textContent = "ERROR:";
        modalMessage.innerHTML = "<p>Error retreiving data!</p>";
        document.getElementById("delLocConfirm").classList.add("d-none");
        document.getElementById("delLocReject").classList.add("d-none");
        document.getElementById("delLocClose").classList.remove("d-none");
      }

    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      document.querySelector("#deleteLocationModal .modal-title").textContent = "ERROR:";
      modalMessage.innerHTML = "<p>Error retreiving data!</p>";
      document.getElementById("delLocConfirm").classList.add("d-none");
      document.getElementById("delLocReject").classList.add("d-none");
      document.getElementById("delLocClose").classList.remove("d-none");
    }
  });

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

      if(result.status.code == 200){
        
        $("#deleteLocationModal").modal("hide");
        loadLocations();

      }else{

        let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
        document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
        document.getElementById("messageModalMessage").innerHTML = "Error deleting Location: "+ result.status.description;
        messageModal.show();

      }

    },
    error: function (jqXHR, status, error) {

      console.error("AJAX Error:", status, error);
      let messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
      document.querySelector("#messageModal .modal-title").innerHTML = "ERROR:";
      document.getElementById("messageModalMessage").innerHTML = "Error deleting Location!";
      messageModal.show();

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


