<?php

require "packages/PHPMailer/PHPMailerAutoload.php";

// get the information passed from the app via the POST method
$_POST = json_decode(file_get_contents("php://input"), true);

$recipients = $_POST['recipients'];
$message = $_POST['message'];
$items = $_POST['items'];
$subject = $_POST['subject'];

$message_list = "<ul>";
$plain_message = " ";

foreach($items as $item) {
    $message_list .= "<li>".$item['name']."</li>";
}

foreach($item as $item) {
    $plain_message .= ", ".$item['name'];
}

$message_list .= "</ul>";

$mail = new PHPMailer;

//$mail->isSMTP();
$mail->Host = 'localhost';
$mail->SMTPAuth = false;

$mail->From = 'colin@webcake.co';
$mail->FromName = 'Colin J';

foreach ($recipients as $recipient) {
    if($recipient['email'] != $recipient['title']) {
        $mail->addAddress($recipient['email'], $recipient['title']);
    } else {
        $mail->addAddress($recipient['email']);
    }
}

$mail->addReplyTo('colin@webcake.co');
$mail->isHTML(true);

$mail->Subject = $subject;
$mail->Body = $message . $message_list;
$mail->AltBody = $message . $plain_message;

if(!$mail->send()) {
    echo "Message could not be sent";
    echo "Mailer Error: " . $mail->ErrorInfo;
} else {
    echo "Message has been sent!";
}