<?php

namespace App\Exceptions;

// use Exception;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Session\TokenMismatchException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\Debug\Exception\FatalThrowableError;


use Symfony\Component\Debug\Exception\FlattenException;
use Symfony\Component\Debug\Exception\OutOfMemoryException;
use Symfony\Component\HttpKernel\Debug\FileLinkFormatter;
use Symfony\Component\Debug\Exception\FatalErrorException;
use Symfony\Component\Debug\Exception\SilencedErrorContext;
use Symfony\Component\Debug\FatalErrorHandler\ClassNotFoundFatalErrorHandler;
use Symfony\Component\Debug\FatalErrorHandler\FatalErrorHandlerInterface;
use Symfony\Component\Debug\FatalErrorHandler\UndefinedFunctionFatalErrorHandler;
use Symfony\Component\Debug\FatalErrorHandler\UndefinedMethodFatalErrorHandler;


class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        \Illuminate\Auth\AuthenticationException::class,
        \Illuminate\Auth\Access\AuthorizationException::class,
        \Symfony\Component\HttpKernel\Exception\HttpException::class,
        \Illuminate\Database\Eloquent\ModelNotFoundException::class,
        \Illuminate\Session\TokenMismatchException::class,
        \Illuminate\Validation\ValidationException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof TokenMismatchException){
            // Catch it here and do what you want. For example...
            // return redirect()->back()->withInput()->with('error', 'Your session has expired');
			 if ($request->expectsJson()){
				 return response()->json(['status' => FALSE,'message' => trans('custom.session_expired'), 'error' => 'Unauthenticated.'], 401); 
			 }
            return redirect()->route('login')
                             ->with('return_popup_status', FALSE) // send back with flashed session data
                             ->with('return_popup_message', trans('custom.session_expired'));
            
        }
        if ($request->expectsJson() || $request->is('api/*')) {
            if ($exception instanceof NotFoundHttpException) {
                return response()->json(['status' => FALSE,'message' => 'URL does not exist', 'data' =>array(), 'code' => config('constants.API_RESPONSE_CODES.NOT_FOUND')], config('constants.API_RESPONSE_CODES.NOT_FOUND'));
            }
            if ($exception instanceof MethodNotAllowedHttpException) {
                return response()->json(['status' => FALSE,'message' => 'Method is not allowed.', 'data' =>array(), 'code' => config('constants.API_RESPONSE_CODES.METHOD_NOT_ALLOWED')], config('constants.API_RESPONSE_CODES.METHOD_NOT_ALLOWED'));
            } 
			if (($exception instanceof FatalThrowableError) || ($exception instanceof FatalErrorException) || ($exception instanceof FatalErrorHandlerInterface) || ($exception instanceof FlattenException) || ($exception instanceof UndefinedFunctionFatalErrorHandler) || ($exception instanceof UndefinedMethodFatalErrorHandler) || ($exception instanceof ClassNotFoundFatalErrorHandler) ) {
                return response()->json(['status' => FALSE,'message' => 'Internal Server Error.', 'data' =>array(), 'code' => config('constants.API_RESPONSE_CODES.INTERNAL_SERVER_ERROR')], config('constants.API_RESPONSE_CODES.INTERNAL_SERVER_ERROR'));
            }
			if ($exception instanceof OutOfMemoryException) {
                return response()->json(['status' => FALSE,'message' => 'Out of memory.', 'data' =>array(), 'code' => config('constants.API_RESPONSE_CODES.INSUFFICIENT_STORAGE')], config('constants.API_RESPONSE_CODES.INSUFFICIENT_STORAGE'));
            }
			if ($exception instanceof FileLinkFormatter) {
                return response()->json(['status' => FALSE,'message' => 'Internal Server Error.', 'data' =>array(), 'code' => config('constants.API_RESPONSE_CODES.INTERNAL_SERVER_ERROR')], config('constants.API_RESPONSE_CODES.INTERNAL_SERVER_ERROR'));
            }
			
			if ($exception instanceof SilencedErrorContext) {
                return response()->json(['status' => FALSE,'message' => 'Internal Server Error.', 'data' =>array(), 'code' => config('constants.API_RESPONSE_CODES.INTERNAL_SERVER_ERROR')], config('constants.API_RESPONSE_CODES.INTERNAL_SERVER_ERROR'));
            }
			if ($exception instanceof \Swift_TransportException){
                return response()->json(['status' => FALSE,'message' => 'Network Error.', 'data' =>array(), 'code' => config('constants.API_RESPONSE_CODES.NETWORK_AUTHENTICATION_REQUIRED')], config('constants.API_RESPONSE_CODES.NETWORK_AUTHENTICATION_REQUIRED'));
            }
			
			if ($exception instanceof \Swift_IoException){
                return response()->json(['status' => FALSE,'message' => 'Something went wrong.', 'data' =>array(), 'code' => config('constants.API_RESPONSE_CODES.SEE_OTHER')], config('constants.API_RESPONSE_CODES.SEE_OTHER'));
            }
            // return response()->view('404', [], 404);
        }
        return parent::render($request, $exception);
    }

    /**
     * Convert an authentication exception into an unauthenticated response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Auth\AuthenticationException  $exception
     * @return \Illuminate\Http\Response
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson()) {
            return response()->json(['status' => FALSE,'message' =>'Unauthenticated.', 'error' => 'Unauthenticated.'], 401);
        }
        
        // $url_segment = \Request::segment(1);
        // if($url_segment == 'admin'){
        //     return redirect()->guest(route('admin_login'));
        // }
        return redirect()->guest(route('login'));
    }
}
