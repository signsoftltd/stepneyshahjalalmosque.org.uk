<?php
/* Hefazothe Islam UK website: settings and helpers shared by every page.
   Each page sets $page (see below), then includes header.php, prints its content and includes footer.php:

   $page = [
     'path'        => 'events',       // the page's clean address after the site folder ('' for the home page)
     'donations'   => true,           // the page has donation forms (see uses_donations())
     'title'       => 'Events | Hefazothe Islam UK',
     'description' => '...',          // search engines and link previews
     'nav'         => 'events',       // menu item to mark as the current page: home, events, services, about, contact
     'home'        => false,          // the home page has the prayer bar, in-page menu links and the "Today" footer column
     'og_type'     => 'article',      // link previews: 'website' for the home page
     'head'        => '',             // extra HTML for <head> (e.g. structured data)
     'scripts'     => ['assets/js/events.js'],  // the page's own scripts (prayer-times.js is always loaded first)
     'after'       => '',             // inline script for the page, printed after its scripts
   ]; */
define('HIUK', true);

// The website's full address, without a slash at the end. Used for link previews (Facebook, WhatsApp, X)
// and search engines.
const SITE_URL = 'https://hefazotheislamuk.org';
const SITE_NAME = 'Hefazothe Islam UK';

/** Text made safe to print in HTML. */
function e($text)
{
	return htmlspecialchars((string) $text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** A file in assets/ with its last-changed time added (?v=...), so browsers load the new version after an update. */
function asset($path)
{
	$file = dirname(__DIR__) . '/' . $path;
	return e($path) . (is_file($file) ? '?v=' . filemtime($file) : '');
}

/** Whether the page being shown is the home page. */
function is_home()
{
	global $page;
	return !empty($page['home']);
}

/** Link to the home page or one of its sections ('#prayer'): just the #section when already on the home page. */
function home_url($section = '')
{
	if (is_home()) {
		return $section !== '' ? $section : '#top';
	}
	return './' . $section;
}

/** Whether the page is shown inside the mobile app (?app=1): just the page's content, without the header,
    menus, footer, cookie banner or notices. */
function in_app()
{
	return ($_GET['app'] ?? '') === '1';
}

/** The app's light/dark choice (?theme=dark or light) when shown inside the app, otherwise ''. */
function app_theme()
{
	$t = $_GET['theme'] ?? '';
	return in_app() && in_array($t, ['dark', 'light'], true) ? $t : '';
}

/** Whether to show the donation basket and load the donation app (with its quick donate button): on every page of
    the website, but inside the app only on pages with donation forms, not e.g. the Zakat calculator or Events. */
function uses_donations()
{
	global $page;
	return !in_app() || !empty($page['donations']);
}

/** aria-current="page" for the menu item of the page being shown. */
function nav_current($item)
{
	global $page;
	return ($page['nav'] ?? '') === $item ? ' aria-current="page"' : '';
}
