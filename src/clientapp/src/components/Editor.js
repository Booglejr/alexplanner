import React from 'react';
import {Table, Form, Input, Label, InputGroup, FormGroup, Button, UncontrolledTooltip, Spinner} from 'reactstrap';
import axios from 'axios';
import '../style/editor.css';


class Editor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gridItems: [],
            selectedTile: null,
            isSyncing: true
        }


        this.handleGridClick = this.handleGridClick.bind(this);
        this.squareClick = this.squareClick.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.handleMPV = this.handleMPV.bind(this);
        this.handleDuration = this.handleDuration.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        //Attempt Syncing
        
        axios.get(`http://127.0.0.1:1987/tile`)
            .then(res => {
                const gridItems = res.data;
                this.setState({gridItems: gridItems, isSyncing: false});
        })
    }

    handleGridClick(e){
        e.preventDefault();
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        if((x/((rect.right-rect.left)/8)) >= 1 && (y/((rect.bottom-rect.top)/50)) >= 2){
            var item = {};
            item.id = null
            item.title = "No Title"
            item.mpv = "MPV command"
            item.modified = true;
            item.day = Math.floor(x/((rect.right-rect.left)/8))-1
            item.hour = Math.floor(y/((rect.bottom-rect.top)/50))/2-1
            item.duration = .5
            item.deleted = null

            var colors = ['default']
            var i  = Math.floor(Math.random() * 6);
            item.color = colors[0];
            var gridItems = this.state.gridItems;
            gridItems.push(item)
            this.setState({gridItems: gridItems});
        }
    }


    sync(){
        this.setState({isSyncing: true});
    }

    handleTitle(e, index){
        e.preventDefault();
        var gridItems = this.state.gridItems;
        gridItems[index].title = e.target.value;
        this.setState({gridItems: gridItems});
    }

    handleMPV(e, index){
        e.preventDefault();
        var gridItems = this.state.gridItems;
        gridItems[index].mpv = e.target.value;
        this.setState({gridItems: gridItems});
    }

    handleDuration(e, index){
        e.preventDefault();
        var gridItems = this.state.gridItems;
        var new_duration = parseFloat(e.target.value);

        if(e.target.value % .5 == 0 && e.target.value >= .5 && (gridItems[index].hour + new_duration) <= 24){
            var ok = true;
            for(var i = 0;i<gridItems.length;i++){
                if(i!=index){
                    var tile = gridItems[index];
                    var other_tile = gridItems[i];
                    if(other_tile.hour > tile.hour && other_tile.hour < (tile.hour + new_duration) && other_tile.day == tile.day){
                        ok = false;
                    }
                }
            }
            if(ok){
                gridItems[index].duration = new_duration;
                this.setState({gridItems: gridItems});
            }
        }
    }

    handleDelete(e, index){
        e.preventDefault();
        //If no ID simply remove it.
        var oldGridItems = this.state.gridItems;
        if(oldGridItems[index].id==null){
            var newGridItems = [];
            for(var i = 0;i<oldGridItems.length;i++){
                if(i!=index){
                    newGridItems.push(oldGridItems[i]);
                }
            }
            this.setState({gridItems: newGridItems, selectedTile:null});
        }else{
            oldGridItems[index].deleted=true;
            oldGridItems[index].modified=true;
            this.setState({gridItems: oldGridItems, selectedTile:null});
        }
    }

    squareClick(e,index){
        e.preventDefault();
        e.stopPropagation();
        this.setState({selectedTile:index});
    }

    render() {
        if(this.props.shouldSync){
            this.sync();
            this.props.syncCallback();
        }

        var dayItems = ["#", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var rows = [];
        for(var i = 0; i<25;i++){
                rows[i] = [];
                for(var x = 0; x<8;x++){
                    if(i == 0){
                        rows[i].push(<th>{dayItems[x]}</th>);
                    }
                    else if(x == 0){
                        rows[i].push(<th className="side">{i-1}</th>);
                    }
                    else{
                        rows[i].push(<td></td>);
                    }
                }
        }

        return !this.state.isSyncing ? (
            <div className="editor-wrapper">
                <div className="time-table">
                    <div onClick={this.handleGridClick} className="grid">
                        {this.state.gridItems.map((value, index) => {
                            var start = value.hour*2+3 //We subtracted an extra 1 to make it 0 in hours.
                            var stop = value.hour*2+3 + value.duration*2
                            var day = value.day+2;
                            var color = value.color;
                            var title = value.title;
                            if (index == this.state.selectedTile){
                                color = "selected";
                            }
                            if(!value.deleted){
                                return( 
                                <div className={"tile " +color} key={index} id={"tile"+index} onClick={(e) => this.squareClick(e, index)} style={{gridArea: start + "/" + day + "/" + stop + "/" + (day+1)}}>
                                    {title}
                                    <UncontrolledTooltip placement="right" target={"tile"+index}>
                                        {title}
                                    </UncontrolledTooltip>
                                </div>)
                            }
                        })}
                    </div>
                    <Table bordered className="table">
                        {rows.map((value, index) => {
                            return <tr>{value}</tr>
                        })}
                    </Table>
                </div>
                <Config handleDelete={this.handleDelete} handleTitle={this.handleTitle} handleDuration={this.handleDuration} handleMPV={this.handleMPV} selectedTile={this.state.selectedTile} gridItems={this.state.gridItems} className="config-panel"/>
            </div>
        ) : (<div class="syncSpace"><Spinner style={{margin: "auto", width: '3rem', height: '3rem'}} color="info"/></div>) ;
    }
}

class Config extends React.Component {
    constructor(props){
        super(props);
        this.handleTitle = this.props.handleTitle;
        this.handleMPV = this.props.handleMPV;
        this.handleDuration = this.props.handleDuration;
        this.handleDelete = this.props.handleDelete;
    }
    
    render(){
        if(this.props.selectedTile != null){
            var tile = this.props.gridItems[this.props.selectedTile];
            var time = "";
            
            if(tile.hour % 1 == .5){
                time+=Math.floor(tile.hour);
                time+=":30"
            }else{
                time+=Math.floor(tile.hour);
                time+=":00"
            }

            time+="-";
            
            if((tile.hour+tile.duration) % 1 == .5){
                time+=Math.floor(tile.hour+tile.duration);
                time+=":30"
            }else{
                time+=Math.floor(tile.hour+tile.duration);
                time+=":00"
            }

            time+=" on ";

            switch (tile.day){
                case 0: time+="Sunday";break;
                case 1: time+="Monday";break;
                case 2: time+="Tuesday";break;
                case 3: time+="Wednesday";break;
                case 4: time+="Thursday";break;
                case 5: time+="Friday"; break;
                case 6: time+="Saturday";break;
            }
        }
        return (this.props.selectedTile != null) ? (
            <div className="config-panel">
            <div className="config-panel-inner">
                <div className="form">
        <h3>{tile.title}<br/><span style={{fontSize:".8rem"}}> from {time}</span></h3>
                <hr/>
                <Form>
                    <FormGroup>
                        <Label htmlFor="Title">Title</Label>
                        <Input placeholder="Title" id="Title" maxlength="50"  onChange={(e) => this.handleTitle(e, this.props.selectedTile)} value={this.props.gridItems[this.props.selectedTile].title} type="text"/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="MPV">MPV Command</Label>
                        <Input placeholder="MPV Command" id="MPV" maxlength="1000" onChange={(e) => this.handleMPV(e, this.props.selectedTile)} value={this.props.gridItems[this.props.selectedTile].mpv} type="textarea"/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="Duration">Duration (Hrs)</Label>
                        <Input placeholder="0.5" id="Duration" step="0.5" onChange={(e) => this.handleDuration(e, this.props.selectedTile)} value={this.props.gridItems[this.props.selectedTile].duration} type="number"/>
                    </FormGroup>
                    <FormGroup className="rightside">
                        <Button color="danger" onClick={(e) => this.handleDelete(e, this.props.selectedTile)}>Delete</Button>
                    </FormGroup>
                </Form>
                </div>
            </div>
        </div>
        ) : (
            <div className="config-panel">
                <div className="config-panel-inner">
                    <div className="form">
                    <h3>No element selected</h3>
                    <h6>Click on a event or time slot to get started</h6>
                    </div>
                </div>
            </div>
        );
    }
}




  export default Editor;