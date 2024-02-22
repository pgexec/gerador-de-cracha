<?php

header('Acess-Control-Allow-Origin:http://127.0.0.1:5501/ ');


$tmp = $_FILES['file']['tmp_name'];
$extension = $_POST['extension'];

$acceptedExtensions = ['jpg','pgn','jpeg'];

if(!in_array());