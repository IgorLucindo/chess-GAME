// reading profile_names.txt
const file_names = new XMLHttpRequest();
var names_text = null;
file_names.open("GET", "../../static/profile_names.txt", false);
file_names.onreadystatechange = () =>{
    if(file_names.readyState == 4){
        if(file_names.status == 200 || file_names.status == 0){
            names_text = file_names.responseText;
        }
    }
};
file_names.send(null);

// getting array of names in profile_names.txt
var names_array = names_text.split("\n");

// getting array of profile images
var profile_image_array = ["../static/images/profile images/burro.jfif",
                           "../static/images/profile images/cebolinha.jfif",
                           "../static/images/profile images/mike_wazowski.jfif",
                           "../static/images/profile images/pé_de_pano.jfif"];


// changing profile name and picture randomly
var random_num_white = Math.floor(Math.random() * names_array.length);
var random_num_black = Math.floor(Math.random() * names_array.length);
while(random_num_black == random_num_white){random_num_black = Math.floor(Math.random() * names_array.length);};
// white player
var profile_image_white_div = document.getElementById("profile_picture_white");
var profile_name_white_div = document.getElementById("profile_name_white");
profile_image_white_div.style.backgroundImage = "url('" + profile_image_array[random_num_white] + "')";
profile_name_white_div.innerHTML = names_array[random_num_white];
// black player
var profile_image_black_div = document.getElementById("profile_picture_black");
var profile_name_black_div = document.getElementById("profile_name_black");
profile_image_black_div.style.backgroundImage = "url('" + profile_image_array[random_num_black] + "')";
profile_name_black_div.innerHTML = names_array[random_num_black];