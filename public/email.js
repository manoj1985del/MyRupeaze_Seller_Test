
function sendEmail(to, subject, html){
    
    var xmlHttp = new XMLHttpRequest();
    var url = '/sendMail/' + to +  '/' + subject;
    xmlHttp.onreadystatechange = function(res){
        if(xmlHttp.readyState == 4){

            console.log(res); 
        }
    }

    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-type", 'text/html; charset="UTF-8"'); 
    xmlHttp.send(html);
}