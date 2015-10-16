<?php



$usersDAO = new usersDAO();

//GET -> /users/
/*$app->get('/users/?', authorize('user'),function() use ($usersDAO){
    header("Content-Type: application/json");

    $arr = $usersDAO->selectAll();
    
    foreach($arr as &$user){
        unset($user['password']);
        unset($user['street']);
        unset($user['town']);
        //$user['password'] = 'derpderp';
    }
    //echo json_encode($arr);
    echo json_encode($arr, JSON_NUMERIC_CHECK);
    exit();
});*/
//$app->post('/login', 'login');
$app->post('/me', function() use ($usersDAO){
    if(!empty($_POST)){
        $_SESSION['user'] = $usersDAO->selectById($_POST['id']);  
    }
    header("Content-Type: application/json");
    echo json_encode($_SESSION['user']);
    exit();
});

$app->post('/logout', function() use ($usersDAO){
    if(!empty($_SESSION['user'])){
        unset($_SESSION['user']);  
    }
    header("Content-Type: application/json");
    echo json_encode("logged out.");
    exit();
});

$app->get('/me', function(){
    header("Content-Type: application/json");
    if(!empty($_SESSION['user'])){
        $arr = $_SESSION['user'];
        unset($arr['password']);
        echo json_encode($arr, JSON_NUMERIC_CHECK);
    }else{
        echo json_encode([]);
    }
    exit();
});

//GET -> /users/:id
$app->get('/users/:id/?', authorize('user'),function($id) use ($usersDAO){
    header("Content-Type: application/json");
    //$arr = $usersDAO->selectByEmail($id);
    //unset($arr['password']);
    //echo json_encode($arr, JSON_NUMERIC_CHECK);
    echo json_encode($usersDAO->selectById($id), JSON_NUMERIC_CHECK);
    exit();
});

$app->get('/users/email/:id/?', function($id) use ($usersDAO){
    header("Content-Type: application/json");
    //$arr = $usersDAO->selectByEmail($id);
    //unset($arr['password']);
    //echo json_encode($arr, JSON_NUMERIC_CHECK);
    echo json_encode($usersDAO->selectByEmail($id), JSON_NUMERIC_CHECK);
    exit();
});

$app->get('/week/users/:week_id/?', authorize('user'), function($week_id) use ($usersDAO){
    header("Content-Type: application/json");

    $arr = $usersDAO->selectByWeek($week_id);
    
    foreach($arr as &$user){
        unset($user['password']);
    }
    echo json_encode($arr, JSON_NUMERIC_CHECK);
    exit();
});


//POST -> /users/
$app->post('/users/?', function() use ($app, $usersDAO){
    header("Content-Type: application/json");
    $post = $app->request->post();
    if(empty($post)){
        $post = (array) json_decode($app->request()->getBody());
    }
    echo json_encode($usersDAO->insert($post), JSON_NUMERIC_CHECK);
    exit();
});

$app->put('/users/:id/?', authorize('user'),function($id) use ($app, $usersDAO){
    header("Content-Type: application/json");
    $post = $app->request->post();
    if(empty($post)){
        $post = (array) json_decode($app->request()->getBody());
    }
    echo json_encode($usersDAO->update($id, $post), JSON_NUMERIC_CHECK);
    exit();
});


/*$app->get('/images/:day_id/?',function($day_id) use ($imagesDAO){
    header("Content-Type: application/json");
    echo json_encode($imagesDAO->selectByDayId($day_id), JSON_NUMERIC_CHECK);
    exit();
});

$app->post('/images/?', function() use ($app, $imagesDAO){
    header("Content-Type: application/json");
    $post = $app->request->post();
    if(empty($post)){
        $post = (array) json_decode($app->request()->getBody());
    }
    echo json_encode($imagesDAO->insert($post), JSON_NUMERIC_CHECK);
    exit();
});*/

$app->post('/upload/user', function(){
    //echo json_encode($_FILES);
    $user_id = $_SESSION['user']['id'];
    $file = $_FILES["SelectedFile"];

    // array of valid extensions
    $validExtensions = array('.jpg', '.jpeg', '.gif', '.png');
    // get extension of the uploaded file
    $fileExtension = strrchr($file['name'], ".");
    // check if file Extension is on the list of allowed ones
        
    if (in_array($fileExtension, $validExtensions)) {
    $newName = $user_id;
    $dotPos = strrpos($file['name'],'.');
    $extension = substr($file['name'],$dotPos+1);
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
    //$manipulator2 = new ImageManipulator($newImage);
    //$newImage2 = $manipulator->crop($x1, $y1, $x2, $y2);
    // saving file to uploads folder
    $manipulator->save(WWW_ROOT . DS . 'uploads' . DS . 'users'.  DS . $newName . "." . $extension);
    //echo 'Done ...';
    } else {
    //echo 'You must upload an image...';
    }

});

