import React from "react";
import ReactDOM from "react-dom"
import marked from "marked"
import $ from 'jquery';


var socket = require('socket.io-client')('http://localhost:8080');

var styleData = null;

var Input = React.createClass({

  componentDidMount() {
    socket.on('text', this.editInput);
  },

  editInput : function(data) {
    console.log(data);
    this.setState({value: data.text});
  },

  getInitialState: function() {
    return {value: ''};
  },

  onChange: function(event) {
    socket.emit('text edited', { text: event.target.value});
    this.setState({value: event.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.sendFormData();
  },

  sendFormData: function () {
    var formData = {
      text: this.state.value,
      style: styleData
    }
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: formData,
      success: function(data) {
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="row">
        <form className="col s6" onSubmit={this.handleSubmit}>
          <textarea value={this.state.value} onChange={this.onChange} />
          <input className= "waves-effect waves-light btn" type="submit" value="Post" />
        </form>
        <Preview text={this.state.value}/>
      </div>
    );
  }
});

var Preview = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.text.toString(), {sanitize: true, gfm: true, breaks: true});
    return { __html: rawMarkup };
  },

  render : function () {
    return (
      <div className ="col s6">
        <span className="preview" dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var Styles = React.createClass ({

  componentDidMount() {
    socket.on('css', this.editInput);
  },

  editInput : function(data) {
    console.log(data);
    this.setState({value: data.text});
  },

  getInitialState: function() {
    return {value: ''};
  },

  onChange: function(event) {
    this.setState({value: event.target.value});
    styleData = event.target.value;
    socket.emit('css edited', { text: event.target.value});
  },

  render: function () {
    return (
      <div>
        <textarea value={this.state.value} onChange={this.onChange} />
        <style>
          {this.state.value}
        </style>
      </div>
    );
  }
});

ReactDOM.render(
  <Input url="/send"/>, document.getElementById('content')
);

ReactDOM.render(
  <Styles />, document.getElementById('styles')
);
