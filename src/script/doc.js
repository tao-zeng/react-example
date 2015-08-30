/*@MODULE_GENERATOR@*/
let React = require('react'),
  RUI = require('react-ui'),
  {Workbench, Data} = RUI,
  MemoryDataPovider = Data.MemoryPovider,
  Doc={};
  Doc.Compontent = {
    Animate : {
        demos : {
            Demo : {
                compontent : require('./animate/doc/demo'),
                code : ''
            }
        },
        readmes : {
        }
    },
    Button : {
        demos : {
            Demo : {
                compontent : require('./button/doc/demo'),
                code : ''
            }
        },
        readmes : {
        }
    },
    Data : {
        demos : {
            Demo : {
                compontent : require('./data/doc/demo'),
                code : ''
            }
        },
        readmes : {
        }
    },
    Http : {
        demos : {
            Demo : {
                compontent : require('./http/doc/demo'),
                code : ''
            }
        },
        readmes : {
        }
    },
    Layout : {
        demos : {
            Demo : {
                compontent : require('./layout/doc/demo'),
                code : 'let React = require(&#39;react&#39;),\n  {Layout} = require(&#39;react-ui&#39;);\nmodule.exports = React.createClass({\n  render() {\n    return (&lt;Layout.Grid title=&#34;Workbench Demo&#34;/&gt;);\n  }\n});\n'
            }
        },
        readmes : {
        }
    },
    Menu : {
        demos : {
            Demo : {
                compontent : require('./menu/doc/demo'),
                code : ''
            }
        },
        readmes : {
        }
    },
    Transition : {
        demos : {
            Demo : {
                compontent : require('./transition/doc/demo'),
                code : ''
            }
        },
        readmes : {
        }
    },
    Util : {
        demos : {
            Core : {
                compontent : require('./util/doc/core'),
                code : ''
            },
            Demo : {
                compontent : require('./util/doc/demo'),
                code : ''
            },
            Dom : {
                compontent : require('./util/doc/dom'),
                code : ''
            },
            Observe : {
                compontent : require('./util/doc/observe'),
                code : ''
            }
        },
        readmes : {
        }
    },
    Workbench : {
        demos : {
            Demo : {
                compontent : require('./workbench/doc/demo'),
                code : 'let React = require(&#39;react&#39;),\n  {WorkBench} = require(&#39;react-ui&#39;);\nmodule.exports = React.createClass({\n  render() {\n    return (&lt;WorkBench compontents={[{\n\n      }]}/&gt;);\n  }\n});\n'
            }
        },
        readmes : {
            Readme : 'read me\n'
        }
    }
  };

class MenuDataPovider extends MemoryDataPovider{
  constructor() {
    super({});
    let Compontents = []
    Object.keys(Doc.Compontent).forEach(compName=>{
      Compontents.push({
        text:compName
      });
    });
    this.data = [{
        text:'Introducation'
    },{
        text:'Getting Started'
    },{
        text:'Compontents',
        children:Compontents
      },{
        text:'GitHub',
        href:'https://github.com/tao-zeng/react-example'
    }];
  }
}
Doc.App = React.createClass({
  render: function(){
    let config = {
        type:'SideLayout',
        children:[{
            type:'Menu',
            option:{
                horizontal:true,
                title:'React UI'
            },
            dataPovider: new MenuDataPovider()
        },{
          type:'GridLayout',
          option:{
            size:'1-2'
          },
          children:[{
            type:'Button',
            text:'Btn1'
          },{
            type:'Button',
            text:'Btn2'
          },{
            type:'Button',
            text:'Btn3'
          }]
        }]
    }
    return <Workbench compontents={config}></Workbench>
  }
});
React.render(<Doc.App/>, document.body);


/*var routes = (
  <Route handler={Workbench} path="/">
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});*/

RUI.Doc = Doc;
module.exports = RUI;
