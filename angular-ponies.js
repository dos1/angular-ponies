// Ponies.
    angular.module('ponies', []).service("ponies", ['$document', function($document) {

            var poniesEnabled = false, document = $document[0];

            function loadScript(src) {
                var sc = document.createElement("script");
                sc.setAttribute('async', 'async');
                sc.src = "js/lib/ponies/" + src;
                var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                head.insertBefore(sc, head.firstChild);
                return sc;
            }

            function loadCSS(src) {
                var li = document.createElement("link");
                li.setAttribute('rel', 'stylesheet');
                li.href = "js/lib/ponies/" + src;
                var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                head.insertBefore(li, head.firstChild);
                return li;
            }

            return function() {
                if (poniesEnabled) {
                    return;
                }
                var sc = loadScript("browserponies.js");
                loadCSS("loader.css");
                sc.onload = sc.onreadystatechange = function() {
                    var sc = loadScript("config.js");
                    sc.onload = sc.onreadystatechange = function() {
                        BrowserPonies.start();
                        var poniesEnabled = true;

                        var $wrapper = $("<div></div>").addClass('pony controls'), $controls = $("<div></div>").addClass("ui buttons top attached").appendTo($wrapper);
                        $('<a href="#">Turn off ponies</a>').addClass("ui blue active button").appendTo($controls).on('click', function() {
                            poniesEnabled = !poniesEnabled;
                            if (poniesEnabled) {
                                BrowserPonies.start();
                                $(this).text('Turn off ponies').addClass('active');
                            }
                            else {
                                BrowserPonies.stop();
                                $(this).text('Turn on ponies').removeClass('active');
                            }
                            return false;
                        });

                        $('<a href="#">+</a>').addClass("ui positive button").appendTo($controls).on('click', function() {
                            BrowserPonies.spawnRandom(1);
                            return false;
                        });
                        $('<a href="#">-</a>').addClass("ui negative button").appendTo($controls).on('click', function() {
                            var ponies = BrowserPonies.ponies();
                            for (var name in ponies) {
                                var pony = ponies[name];
                                if (pony.instances.length >= 1) {
                                    BrowserPonies.unspawn(name, 1);
                                    return false;
                                }
                            }
                            return false;
                        });

                        $wrapper.appendTo('body');

                    };
                };
                poniesEnabled = true;

            };
        }]);
