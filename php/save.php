#!/usr/bin/php-cgi
<?php
	$_POST = json_decode(file_get_contents("php://input"),true);
	$return->error = false;
	$return->score = $_POST['score'];
	$return->content = $_POST['name'].' : '.$_POST['score'];
	echo json_encode($return);
?>

