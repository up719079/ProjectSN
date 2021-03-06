<?php
  //Helpful oAuth documentation: developers.google.com/identity/protocols/OpenIDconnect
  const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
  const TOKEN_ENDPOINT = 'https://www.googleapis.com/oauth2/v4/token';
  const CLIENT_ID = '466310370318-garp5g36h3usomluf7eim8co06ick0lr.apps.googleusercontent.com';
  const CLIENT_SECRET = 'GvCdT1OKKnit8-1nYTxTTcDj';
  const RESPONSE_TYPE = 'code';
  const SCOPE = 'openid email profile';

  /**
   * Intiate oAuth
   * Create state for identification
   * Build redirect URL
   */
  function initate() {
    $state =  md5(uniqid(rand(), TRUE));
    $_SESSION['state'] = $state;
    $msg = 'Redirecting to google for authorisation';
    $url = "".AUTH_ENDPOINT."?client_id=".CLIENT_ID."&response_type=".RESPONSE_TYPE."&scope=".SCOPE."&redirect_uri=".'http://'.$_SERVER['HTTP_HOST'].'/api/2/oauth/authorise'."&state=".$state;
    redirect($url, $msg);
    }

  /**
   * Authorise oAuth
   * Identify response, communicate with google oAuth, decode respose
   */
  function authorise() {
    if(isset($_GET['state']) && ($_GET['state'] === $_SESSION['state'])) {
      $aHTTP = array(
      'http' =>
        array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => "code=".$_GET['code']."&client_id=".CLIENT_ID."&client_secret=".CLIENT_SECRET."&redirect_uri=".'http://'.$_SERVER['HTTP_HOST'].'/api/2/oauth/authorise'."&grant_type=authorization_code"
        )
      );
      $context = stream_context_create($aHTTP);
      $contents = file_get_contents(TOKEN_ENDPOINT, false, $context);
      $results = (array)json_decode($contents); //No need for JWT verfication due to communication directly from google
      list($header, $body, $sign) = explode(".", $results['id_token']); //Split response JWT
      $body = (array)json_decode(base64_decode($body)); //Decode body of response
      $_SESSION['authorised'] = true;
      $_SESSION['sub'] = $body['sub'];
      $login = getLogin($body['sub']);
      if (is_null($login)) {
        header('Location: http://'.$_SERVER['HTTP_HOST'].'/new/user.php');
        $meta['success'] = true;
        $meta['status'] = 302;
        $meta['format'] = 'url';
        $meta['msg'] = 'Please create a user account';
        send($meta);
      }
      else {
        login($login);
        header('Location: http://'.$_SERVER['HTTP_HOST'].'/home.php');
        exit();
      }
    }
    else {
      $meta['status'] = 401;
      $meta['success'] = false;
      $meta['msg'] = "Invalid state, oauth must be intialised at '/oauth'";
      $meta['state'] = $_SESSION['state'];
      send($meta);
      exit;
    }
  }

  function getLogin ($id) {
    $DB = new DB;
    $sql = 'SELECT * FROM Login WHERE id = ?';
    $bind = array($id);
    $result = $DB->query($sql, $bind);
    if (is_null($result)) {
      return null;
    }
    return $result[0];
  }

  function login ($login) {
    $DB = new DB;
    $user = getUser($login['profile']);
    if ($user) {
      $_SESSION['user'] = $user;
      $_SESSION['login'] = true;
      $_SESSION['sub'] = null;
    }
  }

  function logout () {
    session_destroy();
    redirect('/login.php', 'Successfully logged out');
  }





?>
