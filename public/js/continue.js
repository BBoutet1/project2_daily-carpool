

     // Here we grab the form elements
    //  var database = {user1 :
    //     {
    //     fullName: $("#full-name").val(),
    //     customerEmail: $("#email").val(),
    //     destinationID: $("#dest").val(),
    //  },
    //  user2 :{
    //     fullName: $("#full-name").val(),
    //     customerEmail: $("#email").val(),
    //     destinationID: $("#dest").val(),
    //  },
    //  user3 :{
    //     fullName: $("#full-name").val(),
    //     customerEmail: $("#email").val(),
    //     destinationID: $("#dest").val(),
    //  },
    //   };
       
    //     console.log(database);
   
    //     var users = {
    //         userInformation: [{
            
    //         fullName: $("#full-name").val(),
    //         customerEmail: $("#email").val(),
    //         destinationID: $("#dest").val(),
    //      },
    //      {
    //         fullName: $("#full-name").val(),
    //         customerEmail: $("#email").val(),
    //         destinationID: $("#dest").val(),
    //      },
    //      {
    //         fullName: $("#full-name").val(),
    //         customerEmail: $("#email").val(),
    //         destinationID: $("#dest").val(),
    //      }],
    //       };
           
    //         console.log(users);

    //Saves user input data
       var myform = document.getElementById('myForm');
       myform.addEventListener('submit',function(e){
           e.preventDefault();
           var data = formData(myform);
           console.log(data)

       });
       function formData(form){
           var el = form.querySelectorAll('input[type="text"]');
           var myData = {}
           for(var x=0;x<el.length;x++){
            var name = el[x].name;
            var value = el[x].value;
            myData[name ] = value
        }
           
           return myData;
           
       };