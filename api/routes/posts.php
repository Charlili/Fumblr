<?php

define('DS', DIRECTORY_SEPARATOR);
$postsDAO = new postsDAO();

//define('WWW_ROOT', __DIR__ . DS);

$app->get('/posts/user/:user_id/?', authorize('user'),function($user_id) use ($postsDAO){
    header("Content-Type: application/json");
    echo json_encode($postsDAO->selectByUserId($user_id), JSON_NUMERIC_CHECK);
    exit();
});

$app->get('/posts/:id/?', authorize('user'),function($id) use ($postsDAO){
    header("Content-Type: application/json");
    echo json_encode($postsDAO->selectById($id), JSON_NUMERIC_CHECK);
    exit();
});

$app->get('/posts/?', function() use ($postsDAO){
    header("Content-Type: application/json");
    echo json_encode($postsDAO->selectAll(), JSON_NUMERIC_CHECK);
    exit();
});

$app->delete('/posts/:id/?', function($id) use ($postsDAO){
    header("Content-Type: application/json");
    echo json_encode($postsDAO->delete($id));
    exit();
});


$app->post('/posts/?', authorize('user'),function() use ($app, $postsDAO){
    header("Content-Type: application/json");
    $post = $app->request->post();
    if(empty($post)){
        $post = (array) json_decode($app->request()->getBody());
    }
    echo json_encode($postsDAO->insert($post), JSON_NUMERIC_CHECK);
    exit();
});

$app->post('/upload/?',authorize('user'),function(){

    if(!empty($_FILES)){
        $file = $_FILES["SelectedFile"];
        $validExtensions = array('.jpg', '.jpeg', '.gif', '.png');
        $fileExtension = strrchr($file['name'], ".");
       
        if (in_array($fileExtension, $validExtensions)) {
            $newName = $file['name'];
            $dotPos = strrpos($file['name'],'.');
            $extension = substr($file['name'],$dotPos);
            $manipulator = new ImageManipulator($file['tmp_name']);
            $width  = $manipulator->getWidth();
            $height = $manipulator->getHeight();
            $centreX = round($width / 2);
            $centreY = round($height / 2);
            // our dimensions will be 200x130
            $x1 = $centreX - 200; // 200 / 2
            $y1 = $centreY - 200; // 130 / 2

            $x2 = $centreX + 200; // 200 / 2
            $y2 = $centreY + 200; // 130 / 2

            // center cropping to 200x130
            $newImage = $manipulator->resample(400,400,true);
            // saving file to uploads folder
            $manipulator->save(WWW_ROOT . DS . 'uploads' .  DS . $_POST['user_id'] . DS . $_POST['post_id'] . $extension);
            echo json_encode(true);
        }else{
            echo json_encode(false);
        }
    }
    if(!empty($_POST['url'])){
        $dotPos = strrpos($_POST['url'],'.');
        $extension = substr($_POST['url'],$dotPos);
        copy($_POST['url'], WWW_ROOT . DS . 'uploads' .  DS . $_POST['user_id'] . DS . $_POST['post_id'] . $extension);
    }
    
});


