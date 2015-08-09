let React = require('react'),
    {PropTypes} = React,
    Compontent = require('../compontent'),
    Util = require('../util/util'),
    is = require('is');
const normalizeSize = (s = '') => s.toString().replace('/', '-');
let GridCell = Compontent('GridLayoutCell', {
    propTypes:{
        size: PropTypes.string,
        sm: PropTypes.string,
        md: PropTypes.string,
        lg: PropTypes.string,
        xl: PropTypes.string
    },
    getDefaultProps() {
        return {
            size: '1'
        }
    },
    render() {
        const { className, size, sm, md, lg, xl, ...props } = this.props,
            cls=Util.parseClassName('pure-u-' + normalizeSize(size),
                sm && 'pure-u-sm-' + normalizeSize(sm),
                md && 'pure-u-md-' + normalizeSize(md),
                lg && 'pure-u-lg-' + normalizeSize(lg),
                xl && 'pure-u-xl-' + normalizeSize(xl),
                className
            );
        return <div className={cls} {...props} />;
    }
});
let sizePropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.string
]);
let Grid = Compontent('GridLayout', {
    propTypes:{
        size:sizePropType,
        sm: sizePropType,
        md: sizePropType,
        lg: sizePropType,
        xl: sizePropType
    },
    parseSize(size, cfg, idx){
        if(is.string(size)){
            return size;
        }else if(is.fn(size)){
            return size(cfg, idx);
        }else if(is.hash(size)){
            return this.parseSize(size[idx], cfg, idx);
        }else{
            return null;
        }
    },
    compontentHandler(cfg, dom, idx){
        var props = {
            key:idx,
            size:this.parseSize(this.props.size, cfg, idx),
            sm:this.parseSize(this.props.sm, cfg, idx),
            md:this.parseSize(this.props.md, cfg, idx),
            lg:this.parseSize(this.props.lg, cfg, idx),
            xl:this.parseSize(this.props.xl, cfg, idx)
        };
        return <GridCell {...props}>{dom}</GridCell>;
    },
    render() {
        return <div className='pure-g'>{this.renderCompontents()}</div>;
    }
});
module.exports = Grid;
