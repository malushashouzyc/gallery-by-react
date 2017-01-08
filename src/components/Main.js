require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDom from 'react-dom'

let imageDatas = require('../data/imageDatas.json');

let genImageURL = (imageDatasArr) => {
    for (let i = 0, j = imageDatasArr.length; i < j; i++ ) {
        let singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
}

imageDatas = genImageURL(imageDatas);

function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random()*30))
}

let ImgFigure = React.createClass({
	handleClick (e) {

		if (this.props.arrage.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	},

    render () {
    	let styleObj = {};

    	if (this.props.arrage.pos) {
    		styleObj = this.props.arrage.pos;
    	}

    	if (this.props.arrage.rotate) {
    		(['-moz-', '-ms-', '-webkit-', '']).forEach(function () {
    			styleObj['transform'] = 'rotate(' + this.props.arrage.rotate + 'deg)';
    		}.bind(this));
    	}

    	if (this.props.arrage.isCenter) {
    		styleObj.zIndex = 11;
    	}

    	let imgFigureClassName = "img-figure";
    	imgFigureClassName += this.props.arrage.isInverse ? ' is-inverse' : '';

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={(e)=>{this.handleClick(e)}}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2>{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}></div>
                </figcaption>
            </figure>
        )
    }
})

class AppComponent extends React.Component {
	state = {
		imgsArrangeArr: [

		]
	}

	center (index) {
		return function () {
			this.rerrange(index);
		}.bind(this);
	}

	Constant = {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: {
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: {
			x: [0, 0],
			topY: [0, 0]
		}
	}

	inverse (index) {
		return  () => {
			let imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}
	}

	rerrange (centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2),
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true
			}

			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			imgsArrangeTopArr.forEach(function (value, index) {
				imgsArrangeTopArr[index]= {
					pos: {
						top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			})

			for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
				let hPosRangeLORX = null;

				if (i < k) {
					hPosRangeLORX = hPosRangeLeftSecX;
				} else {
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos: {
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			}

			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
	}

	componentDidMount () {
		let _this = this;
		
		let stageDOM = ReactDom.findDOMNode(_this.refs.stage),
		    stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2)

		let imgFigureDOM = ReactDom.findDOMNode(_this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2)

		_this.Constant.centerPos = {
			left: halfStageW - halfImgH,
			top: halfStageH - halfImgH
		}

		_this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		_this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		_this.Constant.hPosRange.rightSecX[0] = halfStageW - halfImgW;
		_this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		_this.Constant.hPosRange.y[0] = -halfImgW;
		_this.Constant.hPosRange.y[1] = stageH - halfImgH;

		_this.Constant.vPosRange.topY[0] = -halfImgH;
		_this.Constant.vPosRange.topY[1] = -halfStageH - halfImgH * 3;
		_this.Constant.vPosRange.x[0] = halfStageW - imgW;
		_this.Constant.vPosRange.x[1] = halfStageW;

		_this.rerrange(0);

	}

    render () {
        let controllerUnits = [],
            imgFigures = [],
            _this = this

        imageDatas.forEach(function (value, index) {
        	if (!_this.state.imgsArrangeArr[index]) {
        		_this.state.imgsArrangeArr[index] = {
        			pos: {
        				left: 0,
        				top: 0
        			},
        			rotate: 0,
        			isInverse: false,
        			isCenter: false
        		}
        	}

            imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} 
            	arrage={_this.state.imgsArrangeArr[index]} 
            	inverse={this.inverse(index)} 
            	center={this.center(index)}/>);
        }.bind(this))

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
