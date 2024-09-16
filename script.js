$(document).ready(function(){

    $('.card').hide();  // to hide all the divs initially

    $('#addbtn').on('click', function(){
        hideAllDivs();
        $('#insert-div').toggle();
    });

    $('#fetchbtn').on('click', function(){
        hideAllDivs();
        $('#fetch-div').toggle();
    });

    $('#deletebtn').on('click', function(){
        hideAllDivs();
        $('#delete-div').toggle();
    });

    $('#updatebtn').on('click', function(){
        hideAllDivs();
        $('#update-div').toggle();
    });

    function hideAllDivs(){
        $('#insert-div').hide();
        $('#fetch-div').hide();
        $('#delete-div').hide();
        $('#update-div').hide();
    }
    // to fetch data from database
    $('#view-data').click(function(){
        $.ajax({
            url : '/data',  
            method : 'GET', //http method
            dataType : 'json',  // expected data format
            success: function(data){
                var tableEle = $("#table-body");
                tableEle.empty();
    
                $.each(data, function(index, row){  //each will unpack the data and iterate 1 by 1 over each element
                    var tbl_row = `
                                    <tr data-ID="${row.ID}">
                                        <td>${row.ID}</td>
                                        <td>${row.name}</td>
                                        <td>${row.cnic}</td>
                                        <td>${row.course}</td>
                                        <td>${row.grade}</td>
                                        <td>${row.gpa}</td>
                                    </tr>
                                `;
                    tableEle.append(tbl_row);
                });
            },
            error: function(xhr, status, error){
                console.log('Error fetching data:', error);
            }
        });
    });
    
    // for adding new data into database
    $("#add-data").click(function(event){
        event.preventDefault();

        var formData = {
            name: $('#name').val(),
            cnic: $('#cnic').val(),
            course: $('#course').val(),
            grade: $('#grade').val(),
            gpa: $('#gpa').val()
        };

        $.ajax({
            url: '/add-data',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response){
                alert('Success');
            },
            error: function(xhr, status, error){
                alert('Error Adding Data:', error);
            }
        });
    });

    // for deleting existing data from database
    $('#delete-button').on('click', function(){
        var userId = $('#delete-id').val();

        if(userId){
            $.ajax({
                url: `/delete-user/${userId}`,
                method: 'DELETE',
                success: function(response){
                    alert (response.message);
                },
                error: function(xhr, status, error){
                    alert('Error Deleting uSer:', error);
                }
            });
        } else {
            alert('Please enter valid user ID to delete')
        }
    });

    // for updating the existing data
    $('#update-data').on('click', function(){

        function clearfields(){
            $('#update-id').val('');
            $('#update-name').val('');
            $('#update-cnic').val('');
            $('#update-course').val('');
            $('#update-grade').val('');
            $('#update-gpa').val('');
        }

        let userId = $('#update-id').val();
        let updatedName =  $('#update-name').val();
        let updatedCnic =  $('#update-cnic').val();
        let updatedCourse =  $('#update-course').val();
        let updatedGrade = $('#update-grade').val();
        let updatedGpa = $('#update-gpa').val();

        let updateData = {};
        if (updatedName) updateData.name = updatedName;
        if (updatedCnic) updateData.cnic = updatedCnic;
        if (updatedCourse) updateData.course = updatedCourse;
        if (updatedGrade) updateData.grade = updatedGrade;
        if(updatedGpa) updateData.gpa = updatedGpa;

        if (userId && Object.keys(updateData).length > 0){
            $.ajax({
                url : `/update-user/${userId}`,
                method : 'PUT',
                contentType : 'application/json',
                data: JSON.stringify(updateData),
                success: function(response){
                    alert(response.message);
                    clearfields();
                },
                error: function(xhr, status, error){
                    alert('Error Updating user:', error);
                }
            });
        } else {
            alert ('Please enter an ID and atleast one field to update');
        }
    });

});

   
 