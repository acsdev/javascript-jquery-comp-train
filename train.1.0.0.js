/**
 * Component to show parts of HTML sequentially
 * Component base on HTML / CSS / javascript (JQuery)
 * 
 * Sample can be found at train.html
 *       
 * @author allansantos
 */
(function( $ ) {

    $.fn.trainBar = function(options) {
        
        var _component         = this;        
        
        var _MSG = {
            STEP : 'Step'
        }

        var _lastIndexSelected = -1;

        var _group             = null;
        var _phases            = null;        
        var _locked            = null;
        var _beforeChange      = null;
        var _afterChange       = null;

        var _attributes = {
            idDIV         : $(_component).attr('id'),
            idUL          : $(_component).attr('id').concat('-ul-train-bar'),
            idLI          : $(_component).attr('id').concat('-li-train-item-'),
            idDivSubTitle : $(_component).attr('id').concat('-div-subtitle-train-bar'),
        }



        var _css = {
            trainBar: 'trainBar',
            circle  : 'circle',
            content : 'content',
            arrow   : 'arrow',
            selected: 'selected'
        };
        
        var _selectors  = {
            idDIV              : '#'.concat( _attributes.idDIV ),
            idUL               : '#'.concat( _attributes.idUL ),
            idLI               : '#'.concat( _attributes.idLI ),
            idDIVSubTitle      : '#'.concat( _attributes.idDivSubTitle )
        }
         
        var _defaultSettings = $.extend({
            group :'',
            phases:[],
            locked: false,
            afterChange : null,
            beforeChange: null
        });

        var selectItem = function( index ) {
            if (_locked) return;
            try { 
                _component.lock();

                if (_beforeChange) {
                    var result = _beforeChange();
                    if (result === undefined) throw new Error('Function before must return true or false');
                    if (! result) return;
                }

                if ( (_lastIndexSelected + 1 == index) || (_lastIndexSelected - 1 == index) ) {

                    var isGoingForwad = (_lastIndexSelected + 1) == index;

                    var phase  = _phases[index];
                    if (isGoingForwad && phase.before) {
                        var result = phase.before();
                        if (result === undefined) throw new Error('Function before must return true or false');
                        if (! result) return;
                    }

                    $('div[data-train-group=_D]'.replace(/_D/g, _group)).hide(); // HIDE ALL AREAS
                    
                    var phase      = _phases[index];
                    var legend     = phase.legend ? phase.legend : phase.shortTitle;
                    var legendText = '_P _N: _S'.replace(/_P/g, _MSG.STEP).replace(/_N/g, index+1).replace(/_S/g, legend);
                    $( _selectors.idDIVSubTitle ).find(':first').html( legendText );
                    
                    var loadWith = _phases[ index ].loadWith;
                    if (typeof loadWith === 'string') {
                        $( loadWith ).show();
                    }
                    
                    if (typeof loadWith === 'object') {
                        
                        if ( !loadWith.fragment ) {
                            $( loadWith.selector ).show();
                            if (phase.after) { phase.after(); }

                        }

                        if ( loadWith.fragment ) {
                            var alreadyLoaded = true;
                            if ( loadWith.fragment.loadIfEmpty ) {
                                alreadyLoaded = $( loadWith.selector ).children().length > 0;
                            }

                            if (alreadyLoaded) {
                                $( loadWith.selector ).show('fast', function() {
                                    if (phase.after) { phase.after(); }
                                });
                            } else {
                                $( loadWith.selector ).empty();
                                $( loadWith.selector ).load( loadWith.fragment.url, function() { 
                                    $( loadWith.selector ).show('fast', function() {
                                        if (phase.after) { phase.after(); }
                                    });
                                });
                            }
                        }
                    }

                    // AFTER CLICK SUCCESS
                    // 1 - Remove selection class
                    // 2 - Add selection class on specify a tag
                    // 3 - "Save" last index clicked
                    $('li[id^=_ID]'.replace(/_ID/g,_attributes.idLI)).find('a').removeClass( _css.selected );
                    $(_selectors.idLI.concat( index )).find('a').addClass( _css.selected );
                    _lastIndexSelected = index;

                    if (_afterChange) _afterChange();
                }
            } finally {
                _component.unlock();
            }
        }

        /**
         * Create HTML
         */
        var _createComponentOnScreen = function() {
            $('div[data-train-group=_D]'.replace(/_D/g, _group)).hide(); // HIDE ALL AREAS

            var ul = $('<ul />', {id: _attributes.idUL })
            $.each( _phases, function( index ) {
                var phase = this;
                
                var li = $('<li />', {id: _attributes.idLI.concat( index )});
                var a = $('<a />', { href: '#', title: phase.fullTitle}  );

                $(a).click(function() { selectItem( index ); });
                
                var spanC = $('<span />', {text: (index+1), class: _css.circle});
                var spanT = $('<span />', {text: phase.shortTitle, class: _css.content });
                var spanA = $('<span />', {class: _css.arrow });

                $(a).append( $(spanC) );
                $(a).append( $(spanT) );
                $(a).append( $(spanA) );

                $(li).append( $(a) );
                $(ul).append( $(li) );
            });            
            
            var divSubTilte = $('<div />', { id:_attributes.idDivSubTitle });
            $(divSubTilte).append( $('<h3 />') );

            $(_selectors.idDIV).empty();
            $(_selectors.idDIV).attr('class', _css.trainBar);
            $(_selectors.idDIV).append( ul );
            $(_selectors.idDIV).append( divSubTilte )
        }

        var _initialize  = function() {
            
            var setts  = $.extend(_defaultSettings, options);

            _phases       = setts.phases;
            _group        = setts.group;
            _locked       = setts.locked;
            _beforeChange = setts.beforeChange;
            _afterChange  = setts.afterChange;

            _createComponentOnScreen( setts );

            selectItem( 0 );

            return _component;
        }

        /**
         * Lock train to move
         */
        _component.lock   = function() { _locked = true; };

        /**
         * Unlock train to move
         */
        _component.unlock = function() { _locked = false; };

        /**
         * Move forward
         */
        _component.forward = function() {
            if (_lastIndexSelected >= (_phases.length - 1)) return;
            selectItem( _lastIndexSelected + 1 );
        }

        /**
         * Move backward
         */
        _component.backward  = function() {
            if (_lastIndexSelected < 1) return;
            selectItem( _lastIndexSelected - 1 );
        }

        /**
         * Return true if component is on first step
         */
        _component.isFirst  = function() {
            return _lastIndexSelected === 0;
        }
        
        /**
         * Return true if component is on last step
         */
        _component.isLast  = function() {
            return _lastIndexSelected === (_phases.length - 1);
        }

        /**
         * Return the position that is action on train bar
         * Obs. start from 0, that means first position is 0, second position is 1 and so on.
         */
        _component.getStepIndex = function() {
            return _lastIndexSelected;
        }

        return _initialize();
    };
}( jQuery ));
