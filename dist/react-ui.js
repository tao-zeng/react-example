(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("material-ui"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "material-ui"], factory);
	else if(typeof exports === 'object')
		exports["RUI"] = factory(require("react"), require("material-ui"));
	else
		root["RUI"] = factory(root["React"], root["Material"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
		Layout: __webpack_require__(2),
		Nav: __webpack_require__(6),
		Workbench: __webpack_require__(8)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	    Side: __webpack_require__(3)
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(4);

	var _require = __webpack_require__(5);

	var Utils = _require.Utils;
	var Mixins = _require.Mixins;
	var Styles = _require.Styles;
	var Paper = _require.Paper;
	var Overlay = _require.Overlay;
	var KeyCode = Utils.KeyCode;
	var StylePropable = Mixins.StylePropable;
	var WindowListenable = Mixins.WindowListenable;
	var Transitions = Styles.Transitions;
	var AutoPrefix = Styles.AutoPrefix;
	var Spacing = Styles.Spacing;

	var Side = React.createClass({ displayName: 'Side',
	  mixins: [StylePropable],
	  contextTypes: {
	    muiTheme: React.PropTypes.object
	  },
	  propTypes: {
	    className: React.PropTypes.string,
	    docked: React.PropTypes.bool,
	    model: React.PropTypes.bool,
	    header: React.PropTypes.element,
	    onOpen: React.PropTypes.func,
	    onClose: React.PropTypes.func,
	    direction: React.PropTypes.string
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      open: false,
	      docked: true,
	      direction: 'left',
	      width: Spacing.desktopKeylineIncrement * 3
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      open: this.props.open
	    };
	  },
	  toggle: function toggle() {
	    this.setState({
	      open: !this.state.open
	    });
	    return this;
	  },
	  close: function close() {
	    this.setState({
	      open: false
	    });
	    if (this.props.onClose) this.props.onClose();
	    return this;
	  },
	  open: function open() {
	    this.setState({
	      open: true
	    });
	    if (this.props.onOpen) this.props.onOpen();
	    return this;
	  },
	  getThemePalette: function getThemePalette() {
	    return this.context.muiTheme.palette;
	  },
	  getTheme: function getTheme() {
	    return this.context.muiTheme.component.leftNav;
	  },
	  getStyles: function getStyles() {
	    var styles = {
	      root: {
	        position: 'fixed',
	        zIndex: 10,
	        left: 0,
	        top: 0,
	        right: 0,
	        bottom: 0,
	        transform: this._getTransformCss(),
	        transition: !this.state.swiping && Transitions.easeOut(),
	        backgroundColor: this.getTheme().color,
	        overflow: 'hidden'
	      },
	      horizontal: {
	        height: '100%',
	        width: this.props.width
	      },
	      vertical: {
	        width: '100%',
	        height: this.props.width
	      },
	      right: {
	        left: 'auto'
	      },
	      bottom: {
	        top: 'auto'
	      }
	    };
	    return styles;
	  },
	  render: function render() {
	    var overlay = undefined;
	    var styles = this.getStyles();
	    if (!this.props.docked) {
	      overlay = React.createElement(Overlay, { ref: 'overlay',
	        show: this.state.open,
	        transitionEnabled: !this.state.swiping,
	        onTouchTap: this._onOverlayTouchTap });
	    }
	    var style = this.mergeAndPrefix(styles.root, styles[this.props.direction], styles[this._isVertical() ? 'vertical' : 'horizontal'], this.props.style);

	    return React.createElement('div', { className: this.props.className }, overlay, React.createElement(Paper, { ref: 'clickAwayableElement',
	      zDepth: 2,
	      rounded: false,
	      transitionEnabled: !this.state.swiping,
	      style: style }, this.props.children));
	  },
	  _isVertical: function _isVertical() {
	    return this.props.direction === 'top' || this.props.direction === 'bottom';
	  },
	  _getTransformCss: function _getTransformCss(translateSize) {
	    if (translateSize === null || translateSize === undefined) {
	      translateSize = this._getMaxTranslate();
	    }
	    var size = this._getTranslateMultiplier() * (this.state.open ? 0 : translateSize);
	    if (!this._isVertical()) {
	      return 'translate3d(' + size + 'px, 0, 0)';
	    } else {
	      return 'translate3d(0, ' + size + 'px, 0)';
	    }
	  },
	  _getTranslateMultiplier: function _getTranslateMultiplier() {
	    return this.props.direction === 'left' || this.props.direction === 'top' ? -1 : 1;
	  },
	  _getMaxTranslate: function _getMaxTranslate() {
	    if (!this._isVertical()) {
	      return this.props.width + 10;
	    } else {
	      return this.props.width + 10;
	    }
	  },
	  _onOverlayTouchTap: function _onOverlayTouchTap() {
	    this.close();
	  }
	});
	module.exports = Side;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	    SideNav: __webpack_require__(7)
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(4);

	var _require = __webpack_require__(5);

	var MenuItem = _require.MenuItem;
	var LeftNav = _require.LeftNav;
	var Styles = _require.Styles;
	var Colors = Styles.Colors;
	var Spacing = Styles.Spacing;
	var Typography = Styles.Typography;
	var Side = __webpack_require__(3);
	var SildeNav = React.createClass({ displayName: 'SildeNav',
	  getInitialState: function getInitialState() {
	    return {
	      menuItems: [{ route: 'get-started', text: 'Get Started' }, { route: 'customization', text: 'Customization' }, { route: 'components', text: 'Components' }, { type: MenuItem.Types.SUBHEADER, text: 'Resources' }, { type: MenuItem.Types.LINK, payload: 'https://github.com/callemall/material-ui', text: 'GitHub' }, { type: MenuItem.Types.LINK, payload: 'http://facebook.github.io/react', text: 'React' }, { type: MenuItem.Types.LINK, payload: 'https://www.google.com/design/spec/material-design/introduction.html', text: 'Material Design' }]
	    };
	  },
	  getStyles: function getStyles() {
	    return {
	      cursor: 'pointer',
	      //.mui-font-style-headline
	      fontSize: '24px',
	      color: Typography.textFullWhite,
	      lineHeight: Spacing.desktopKeylineIncrement + 'px',
	      fontWeight: Typography.fontWeightLight,
	      backgroundColor: Colors.cyan500,
	      paddingLeft: Spacing.desktopGutter,
	      paddingTop: '0px',
	      marginBottom: '8px'
	    };
	  },
	  render: function render() {
	    var header = React.createElement('div', { style: this.getStyles(), onTouchTap: this._onHeaderClick }, this.props.title);

	    return React.createElement(Side, { ref: 'nav' }, React.createElement('div', { style: this.getStyles(), onTouchTap: this._onHeaderClick }, this.props.title));
	  },
	  toggle: function toggle() {
	    this.refs.nav.toggle();
	  },
	  _getSelectedIndex: function _getSelectedIndex() {
	    return 0;
	  },
	  _onNavChange: function _onNavChange(e, key, payload) {},
	  _onHeaderClick: function _onHeaderClick() {
	    //this.context.router.transitionTo('root');
	    this.refs.nav.close();
	  }
	});
	module.exports = SildeNav;

	//this.context.router.transitionTo(payload.route);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(4);

	var _require = __webpack_require__(5);

	var AppCanvas = _require.AppCanvas;
	var AppBar = _require.AppBar;
	var IconButton = _require.IconButton;
	var TimePicker = _require.TimePicker;
	var DatePicker = _require.DatePicker;
	var Styles = _require.Styles;
	var SildeNav = __webpack_require__(7);

	var ThemeManager = new Styles.ThemeManager();
	var WorkBench = React.createClass({ displayName: 'WorkBench',
	  mixins: [React.addons.LinkedStateMixin],
	  getInitialState: function getInitialState() {
	    return {};
	  },
	  childContextTypes: {
	    muiTheme: React.PropTypes.object
	  },
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: ThemeManager.getCurrentTheme()
	    };
	  },
	  getRightIconStyle: function getRightIconStyle() {
	    return {
	      color: Styles.Colors.darkWhite
	    };
	  },
	  render: function render() {
	    var githubIcon = React.createElement(IconButton, { iconClassName: 'fa fa-github', iconStyle: this.getRightIconStyle(), href: 'https://github.com/tao-zeng/react-example', linkButton: true });
	    return React.createElement(AppCanvas, null, React.createElement('div', null, React.createElement(AppBar, { title: this.props.title, onLeftIconButtonTouchTap: this._onLeftIconButtonTouchTap, iconElementRight: githubIcon })), React.createElement(TimePicker, { format: '24hr', hintText: '24hr Format' }), React.createElement(DatePicker, {
	      hintText: 'Landscape Dialog',
	      mode: 'landscape',
	      showYearSelector: true }), React.createElement(SildeNav, { ref: 'nav', title: this.props.title }));
	  },
	  _onLeftIconButtonTouchTap: function _onLeftIconButtonTouchTap() {
	    this.refs.nav.toggle();
	    console.log('-->', this);
	  }
	});
	module.exports = WorkBench;

/***/ }
/******/ ])
});
;