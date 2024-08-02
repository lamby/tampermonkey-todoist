// ==UserScript==
// @name         Todoist improvements
// @namespace    https://github.com/lamby/tampermonkey-todoist
// @version      2024-08-02
// @description  Makes Todoist eg. nicer to print
// @author       Chris Lamb
// @match        https://app.todoist.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=todoist.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = jQuery;
    window.$ = jQuery;

    setInterval(function () {
        var elem = $('#view-options-menu-description');

        if (elem.length === 0 || $('#print-button').length === 1) {
            return;
        }

        var button = $('<button id="print-button" type="button">Print</button>');

        button.on('click', function () {
            print();
        });

        button.insertBefore(elem);
    }, 1000);

    var print = function () {
        var title = $('h1').last().html();
        var items = getItems();
        var html = "";

        html += '<html>';
        html += '<head>';
        html += '<style type="text/css">';
        html += 'html { font-family: -apple-system, system-ui, "Segoe UI", Roboto, Noto, Oxygen-Sans, Ubuntu, Cantrell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" }';
        html += 'a { color: inherit; text-decoration: none; }';
        html += 'img.emoji { height: 14px; }';
        html += 'ul { list-style: none; padding-left: 14px; margin-top: -6px; }';
        html += 'li:before { content: "◯"; position: relative; left: -7px; }';
        html += 'li { padding-bottom: 6px; }';
        html += 'h1 { padding-bottom: 16px; }';
        html += 'h2 { margin-top: -4px; }';
        html += '</style>';
        html += '</head>';
        html += '<body>';
        html += "<h1>" + title + "</h1>"

        $(items).each(function () {
            if (this['items'].length === 0) {
                return;
            }
            if (this['title'] !== "") {
                html += "<h2>" + this['title'] + "</h2>";
            }

            html += "<ul>";
            $(this['items']).each(function() {
                html += "<li>" + this + "</li>";
            });

            html += "</ul>";
        });

        var window_ = window.open();
        $(window_.document.body).append(html);
    };

    var getItems = function () {
        var result = [];
        $('main section').each(function() {
            var elem = $(this);
            var section = {};
            section['items'] = [];

            section['title'] = elem.find(".section_head__title span").html();
            if (typeof section['title'] === "undefined") {
                section['title'] = elem.find("h2 span, h2 a").html();
            }
            if (section['title'] === "(No Section)") {
                section['title'] = "";
            }

            var items = [];
            elem.find(".task_content").each(function () {
                section['items'].push($(this).html());
            });

            result.push(section);
        });
        return result;
    };
})();