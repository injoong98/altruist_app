<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * API helper
 *
 * UNY 
 *
 * @author SeiKun Lee ( saykunlee@gmail.com )
 */

/**
 * json 형태로 반환 / 에러시 에러 반환
 */
if ( ! function_exists('get_json_result')) {
    function get_json_result($std_data) {
        $result_json_encode = json_encode($std_data);
        if(!$result_json_encode) {
            $result =[];
            $result['result'] =false;
            switch (json_last_error()) {
                case JSON_ERROR_NONE:
                    $result['msg']= ' - No errors';
                    break;
                case JSON_ERROR_DEPTH:
                    $result['msg']= ' - Maximum stack depth exceeded';
                    break;
                case JSON_ERROR_STATE_MISMATCH:
                    $result['msg']= ' - Underflow or the modes mismatch';
                    break;
                case JSON_ERROR_CTRL_CHAR:
                    $result['msg']= ' - Unexpected control character found';
                    break;
                case JSON_ERROR_SYNTAX:
                    $result['msg']= ' - Syntax error, malformed JSON';
                    break;
                case JSON_ERROR_UTF8:
                    $result['msg']= ' - Malformed UTF-8 characters, possibly incorrectly encoded';
                    break;
                default:
                    $result['msg']= ' - Unknown error';
                break;
            }
            // make error json format
        }else{
            $result['result'] =true;
            $result['msg']= ' - succes json encode';
        }	
        return  $result; 
    }	
}

if ( ! function_exists('response_result')) {
    function response_result($r) {
        $return_result = [];
        $result_code ='';
        $return_result =$r;
        $result_json = get_json_result($return_result);

        //set status
        if( $result_json['result'] ) {
          //  $return_result['cnt'] =$rows;
            if($result_code !== "Err") {
                $return_result['status'] ='200';
                $return_result['message'] ='OK';
            }else{
                $return_result['status'] ='500';
                $return_result['message'] = $result_msg;

            } 
        }else {
        //    $return_result['cnt'] =$rows;
            $return_result['row'] =false;
             $return_result['status'] ='950';
             $return_result['message'] =$result_json['msg'];
         }

        //결과응답
		header("Content-Type: application/json; charset=utf-8");
		//header("Content-Type: text/html; charset=euc-kr");
		echo json_encode($return_result ,JSON_UNESCAPED_UNICODE);
    }
}

//사용자 에러 처리
if ( ! function_exists('response_error')) {
    function response_error($error) {
        
        switch ($error) {
            case '조회 결과가 없습니다.':
                $return_result['row'] =NULL;
                $return_result['rows'] =0;
                 $return_result['status'] ='200';
                 $return_result['message'] =$error;
                break;
            case '입실가능 객실이 없습니다. 프런트에 문의해주세요.':
                $return_result['row'] =NULL;
                $return_result['rows'] =0;
                 $return_result['status'] ='200';
                 $return_result['message'] =$error;
                break;
            case '필수 요청 값이 없습니다.':
                $return_result['row'] =false;
                 $return_result['status'] ='200';
                 $return_result['message'] =$error;
                break;
            default:
                $return_result['row'] =false;
                 $return_result['status'] ='500';
                 $return_result['message'] =$error;
            break;
        }
      

        //결과응답
		header("Content-Type: application/json; charset=utf-8");
		//header("Content-Type: text/html; charset=euc-kr");
		echo json_encode($return_result ,JSON_UNESCAPED_UNICODE);
    }
}


if ( ! function_exists('make_result_json')) {
    function make_result_json($query_result,$rows)
    {
        $encoded_result = $this->encode_result($query_result);
        $row = array(
            "row" => $severity
        );
        $result = array(
                'row' => $row
                ,'cnt' => $rows
                ,'status' => 500
                ,'message' => $message
            
        );


        if (ob_get_level() > $this->ob_level + 1)
        {
            ob_end_flush();
        }
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode($result);

    }
}