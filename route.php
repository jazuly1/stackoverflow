<?php
/* > using to close php tag */
use Illuminate\Http\Request;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'auth', 'middleware' => 'cors'], function ($router) {
    Route::post('login', 'Auth\AuthController@login');
    Route::post('logout', 'Auth\AuthController@logout');
});

Route::group(['middleware' => 'cors'], function(){
	/* Create Manual */
	Route::post('user/createuser', 'Admin\UserController@CreateUser');
	Route::post('user/createroute', 'Admin\UserController@Generate');

	/* Don't Change This Block */
	/* get route */
	Route::get('route/routelist', 'Admin\RouteController@getRouteList');

	/* post route */
	/* put route */

	/* patch route */

	/* delete route */
	Route::delete('route/routedelete/{id}', 'Admin\RouteController@deleteRoute');

	/* options route */
	/* Don't Change This Block */
	
});
