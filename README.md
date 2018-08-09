# javascript-jquey-comp-train
 JQuery component to show pages in sequencial parts

* Features
	* JSON as component configurations
    * Many external controls
        - forward()
		- backward()
		- isFirst()
		- isLast()
		- getStepIndex()
		- lock()
		- unlock()
    * Fragments can be load or simple displayed
        - To load external HTML you must config a phase like this:
        ```
        'phases' : [{
            ...
            'shortTitle': 'Title of train phase', 
            'loadWith'  : {
                'selector' : <JQUERY_SELECTOR_OF_DIV_DESTINY_TO_HTML_FRAGMENT>,
                'fragment' : { 
                    'loadIfEmpty': true,
                    'url': <URL_FRAGMENT_HTML>
                }
            }
            ...
        }]
        ```
        - To just display HTML ( recommend ) you just need to use like this:
        ```
        'phases' : [{
            ...
            'shortTitle': 'Title of train phase', 
            'loadWith'  : {
                'selector' : <JQUERY_SELECTOR_OF_DIV_TO_DISPLAY_CONTENT>,
            }
            ...
        }]
        ```

Samples of how to use can be found in **index.html**
Page index.html should look like this:

![alt text](https://github.com/acsdev/javascript-jquey-comp-train/blob/master/train.1.0.0.png)
