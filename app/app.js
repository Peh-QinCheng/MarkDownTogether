import React from "react";
import ReactDOM from "react-dom"
import marked from "marked"
import $ from 'jquery';

var styleData = null;

var Input = React.createClass({
  getInitialState: function() {
    return {typed: ''};
  },

  onChange: function(event) {
    this.setState({typed: event.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.sendFormData();
  },

  sendFormData: function () {
    var formData = {
      text: this.state.typed,
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
      <div>
        <form onSubmit={this.handleSubmit}>
          <textarea onChange={this.onChange} />
          <input type="submit" value="Post" />
        </form>
        <Preview text={this.state.typed}/>
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
      <div>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var Styles = React.createClass ({
  getInitialState: function() {
    return {typed: ''};
  },

  onChange: function(event) {
    this.setState({typed: event.target.value});
    styleData = event.target.value;
    console.log(styleData);
  },

  render: function () {
    return (
      <div>
        <textarea onChange={this.onChange} />
        <style>
          {this.state.typed}
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
