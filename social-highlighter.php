<?php
/*
 * Plugin Name: Social Highlighter
 * Description: Easily share your blog content on Twitter or Email by highlighting text on the page.
 * Version: 2.2
 * Author: D Condrey
 * Author URI: http://www.dreamchallengecreate.com/
 * License: GPLv2
 */

add_filter( 'wp_footer', 'enqueue_footer_scripts', 9);
add_filter( 'wp', 'enqueue_styles', 11);

function enqueue_footer_scripts() {
	wp_register_script( 'social-highlighter-js', plugins_url('/js/social-highlighter.js', __FILE__), array('jquery'));
	wp_enqueue_script( 'social-highlighter-js' );
	echo "<script>jQuery(document).ready(function ($) { $('p').socialHighlighterShare();});</script>";	
}

function enqueue_styles() {
	wp_register_style('social-highlighter', plugins_url('/css/social-highlighter.css', __FILE__), false, '2.1');
	wp_enqueue_style('social-highlighter');
}

?>