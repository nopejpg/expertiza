jQuery(document).ready(function() {
  // This preloadedImages function is refered from http://jsfiddle.net/slashingweapon/8jAeu/
  // Actually I am not using the values in preloadedImages, but image loading speed is indeed getting faster
  var preloadedImages = []
  function preloadImages() {
    for (var idx = 0; idx < arguments.length; idx++) {
        var oneImage = new Image()
        oneImage.src = arguments[idx];
        preloadedImages.push(oneImage);
    }
  }

  function formatDate(date) {
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " - " + strTime;
  }

  function showIntelligentAssignmentDialog() {
    jQuery( "#intelligent_assignment_dialog" ).dialog({ closeText: "hide", modal: true, resizable: false, width: 500 });
  }

  var RowAction = React.createClass({
    getInitialState: function() {
      return {
        showDetails: true
      }
    },
    handleButtonClick: function(e) {
      e.stopPropagation()
      if (e.target.type === 'button') {
        if (e.target.name === 'more') {
          this.setState({
            showDetails: true
          })
        }
      }
    },
    render: function() {
      var moreContent = []
      var buttonContent = ""
      var moreButtonStyle = {
        "display": "",
        "padding": "0 2px"
      }
      var formStyle = {
        margin: 0,
        padding: 0,
        display: 'inline'
      }
      if (this.props.dataType === 'questionnaire') {
        return (
          <span onClick={this.handleButtonClick}>
            <form
              style={formStyle}
              action={"/questionnaires/new"}
              method="GET">
              <input type="hidden" name="model" value={this.props.parent_name+"Questionnaire"} />
              <input type="hidden" name="private" value={1} />
              <button type="submit"
                      className="btn btn-primary questionnaire-button">
                  <b>+</b>
              </button>
            </form>
          </span>
        )
      }
      if (this.state.showDetails) {
        moreButtonStyle.display = "none"
        var newNodeType = this.props.nodeType
        if (this.props.nodeType === 'assignment' || this.props.nodeType === 'questionnaire') {
          newNodeType = this.props.nodeType + "s"
        }
        if (this.props.is_available || newNodeType == 'questionnaires') {
          moreContent.push(
            <span>
              <a title="Edit" href={"/"+newNodeType+"/"+(parseInt(this.props.id)/2).toString()+"/edit"}><img src="/assets/tree_view/edit-icon-24.png" /></a>
              <a title="Delete" href={"/tree_display/confirm?id="+(parseInt(this.props.id)/2).toString()+"&nodeType="+newNodeType}><img src="/assets/tree_view/delete-icon-24.png" /></a>
            </span>
          )
        }
        moreContent.push(
          <span>
            <a title="Copy" href={"/"+newNodeType+"/copy?assets=course&id="+(parseInt(this.props.id)/2).toString()}><img src="/assets/tree_view/Copy-icon-24.png" /></a>
          </span>
        )
        if (newNodeType === 'course') {
          moreContent.push(
            <br/>
          )
          if (this.props.is_available) {
            moreContent.push(
              <span>
                <a title="Add TA" href={"/course/view_teaching_assistants?id="+(parseInt(this.props.id)/2).toString()+"&model=Course"}>
                  <img src="/assets/tree_view/add-ta-24.png" />
                </a>
                <a title="Create assignment" href={"/assignments/new?parent_id="+(parseInt(this.props.id)/2).toString()}>
                  <img src="/assets/tree_view/add-assignment-24.png" />
                </a>
                <a title="Add participants" href={"/participants/list?id="+(parseInt(this.props.id)/2).toString()+"&model=Course"}>
                  <img src="/assets/tree_view/add-participant-24.png" />
                </a>
                <a title="Create teams" href={"/teams/list?id="+(parseInt(this.props.id)/2).toString()+"&type=Course"}>
                  <img src="/assets/tree_view/create-teams-24.png" />
                </a>
                <a title="View grade summary by student" href={"/assessment360/course_student_grade_summary?course_id="+(parseInt(this.props.id)/2).toString()}>
                  <img src="/assets/tree_view/360-dashboard-24.png" />
                </a>
                <a title="Assign survey" href={"/survey_deployment/new?id="+(parseInt(this.props.id)/2).toString()+"&type=CourseSurveyDeployment"}>
                  <img src="/assets/tree_view/assign-survey-24.png" />
                </a>
                <a title="View aggregated teammate & meta reviews" href={"/assessment360/all_students_all_reviews?course_id="+(parseInt(this.props.id)/2).toString()}>
                  <span style={{"fontSize": "22px", "top": "8px"}} className="glyphicon glyphicon-list-alt"></span>
                </a>
              </span>
            )
          }
        } else if (newNodeType === 'assignments') {
          // Assignment tab starts here
          // Now is_intelligent and Add Manager related buttons have not been added into the new UI
          moreContent.push(
            <br/>
          )
          if (this.props.course_id) {
            moreContent.push(
              <span>
                <a title="Remove from course" href={"/assignments/remove_assignment_from_course?id="+(parseInt(this.props.id)/2).toString()}>
                  <img src="/assets/tree_view/remove-from-course-24.png" />
                </a>
              </span>
            )
          } else {
            moreContent.push(
              <span>
                <a title="Assign to course" href={"/assignments/associate_assignment_with_course?id="+(parseInt(this.props.id)/2).toString()}>
                  <img src="/assets/tree_view/assign-course-blue-24.png" />
                </a>
              </span>
            )
          }
          if (this.props.is_available) {
            moreContent.push(
              <span>
                <a title="Add participants" href={"/participants/list?id="+(parseInt(this.props.id)/2).toString()+"&model=Assignment"}>
                  <img src="/assets/tree_view/add-participant-24.png" />
                </a>
              </span>
            )
            if (parseInt(this.props.max_team_size) > 1) {
              moreContent.push(
                <span>
                  <a title="Create teams" href={"/teams/list?id="+(parseInt(this.props.id)/2).toString()+"&type=Assignment"}>
                    <img src="/assets/tree_view/create-teams-24.png" />
                  </a>
                </span>
              )
            }
            // if ends
            moreContent.push(
              <span>
                <a title="Assign reviewers" href={"/review_mapping/list_mappings?id="+(parseInt(this.props.id)/2).toString()}>
                  <img src="/assets/tree_view/assign-reviewers-24.png" />
                </a>
                <a title="Assign survey" href={"/survey_deployment/new?id="+(parseInt(this.props.id)/2).toString()+"&type=AssignmentSurveyDeployment"}>
                  <img src="/assets/tree_view/assign-survey-24.png" />
                </a>
              </span>
            )
            if (this.props.require_quiz) {
              moreContent.push(
                <span>
                  <a title="View quiz questions" href={"/student_quizzes/review_questions?id="+(parseInt(this.props.id)/2).toString()+"&type=Assignment"}>
                    <img src="/assets/tree_view/view-survey-24.png" />
                  </a>
                </span>
              )
            }
            // if ends
            moreContent.push(
              <br/>
            )
            moreContent.push(
              <span>
                <a title="View submissions" href={"/assignments/list_submissions?id="+(parseInt(this.props.id)/2).toString()}>
                  <img src="/assets/tree_view/List-submisstions-24.png" />
                </a>
                <a title="View scores" href={"/grades/view?id="+(parseInt(this.props.id)/2).toString()}>
                  <img src="/assets/tree_view/view-scores-24.png" />
                </a>
                <a title="View reports" href={"/reports/response_report?id="+(parseInt(this.props.id)/2).toString()}>
                  <img src="/assets/tree_view/view-review-report-24.png" />
                </a>
              <a title="View survey responses" href={"/survey_response/view_responses?id="+(parseInt(this.props.id)/2).toString()}>
                  <img src="/assets/tree_view/view-survey-24.png" />
                </a>
              </span>
            )

            if(this.props.is_intelligent) {
              moreContent.push(
                <a title="Intelligent Assignment" href={"/lottery/run_intelligent_assignment/"+(parseInt(this.props.id)/2).toString()}>
                  <img src="/assets/tree_view/run-lottery.png" />
                </a>
              )
            }

            if (this.props.allow_suggestions) {
              moreContent.push(
                <span>
                  <a title="View suggestions" href={"/suggestion/list?id="+(parseInt(this.props.id)/2).toString()+"&type=Assignment"}>
                    <img src="/assets/tree_view/view-suggestion-24.png" />
                  </a>
                </span>
              )
            }
            // if ends
            
            if (this.props.has_topic) {
                // Moved content out of this to the block outside this containing "if" statement
            }
          }
          // if ends

        } else if (newNodeType === 'questionnaires'){
          moreContent.push(
            <span>
              <a title="View questionnaire" href={"/questionnaires/view?id="+(parseInt(this.props.id)/2).toString()}>
                <img src="/assets/tree_view/view-survey-24.png" />
              </a>
            </span>
          )
        }
        // if ends
      }
      return (
        <span onClick={this.handleButtonClick}>
          <button style={moreButtonStyle} name="more" type="button" className="glyphicon glyphicon-option-horizontal">
          </button>
          {moreContent}
        </span>
      )
    }
  })

  var SimpleTableRow = React.createClass({
    render: function () {
      var creation_date;
      var updated_date;
      var colWidthArray = ["30%", "0%", "0%", "0%", "25%", "25%", "20%"]
      var colDisplayStyle = {
        "display": ""
      }
      if (this.props.dataType === 'questionnaire') {
        colWidthArray = ["30%", "0%", "0%", "0%", "20%", "20%", "30%"]
        colDisplayStyle = {
          "display": "none"
        }
      } else if(this.props.dataType === 'course') {
        colWidthArray = ["20%", "0%", "0%", "20%", "20%", "20%", "20%"]
      }
      if (this.props.creation_date && this.props.updated_date) {
        creation_date = this.props.creation_date.replace("T", "<br/>")
        updated_date = this.props.updated_date.replace("T", "<br/>")
      }
      var nodeTypeRaw = this.props.id.split("_")[0]
      var nodeType = nodeTypeRaw.substring(0, nodeTypeRaw.length-4).toLowerCase()
      var id = this.props.id.split("_")[1]
        if (this.props.dataType == 'course') {
            var institution_name = "-"
            if(typeof this.props.institution !== 'undefined' && this.props.institution.length != 0){
              institution_name = this.props.institution[0].name
            }
            return (
                <tr id={this.props.id}>
                    <td width={colWidthArray[0]}>{this.props.name}</td>
                    <td style={colDisplayStyle} width={colWidthArray[3]}>{institution_name}</td>
                    <td width={colWidthArray[4]} dangerouslySetInnerHTML={{__html: creation_date}}></td>
                    <td width={colWidthArray[5]} dangerouslySetInnerHTML={{__html: updated_date}}></td>
                    <td width={colWidthArray[6]}>
                        <RowAction
                            actions={this.props.actions}
                            key={"simpleTable_"+this.props.id}
                            nodeType={nodeType}
                            parent_name={this.props.name}
                            private={this.props.private}
                            is_available={this.props.is_available}
                            course_id={this.props.course_id}
                            max_team_size={this.props.max_team_size}
                            is_intelligent={this.props.is_intelligent}
                            require_quiz={this.props.require_quiz}
                            allow_suggestions={this.props.allow_suggestions}
                            has_topic={this.props.has_topic}
                            id={id}
                        />
                    </td>
                </tr>
            )
        }
        else{
            return (
                <tr id={this.props.id}>
                    <td width={colWidthArray[0]}>{this.props.name}</td>
                    <td width={colWidthArray[4]} dangerouslySetInnerHTML={{__html: creation_date}}></td>
                    <td width={colWidthArray[5]} dangerouslySetInnerHTML={{__html: updated_date}}></td>
                    <td width={colWidthArray[6]}>
                        <RowAction
                            actions={this.props.actions}
                            key={"simpleTable_"+this.props.id}
                            nodeType={nodeType}
                            parent_name={this.props.name}
                            private={this.props.private}
                            is_available={this.props.is_available}
                            course_id={this.props.course_id}
                            max_team_size={this.props.max_team_size}
                            is_intelligent={this.props.is_intelligent}
                            require_quiz={this.props.require_quiz}
                            allow_suggestions={this.props.allow_suggestions}
                            has_topic={this.props.has_topic}
                            id={id}
                        />
                    </td>
                </tr>
            )
        }
    }
  })

  var SimpleTable = React.createClass({
    render: function() {
      var _rows = []
      var _this = this
      var colWidthArray = ["30%", "0%", "0%", "0%", "25%", "25%", "20%"]
      var colDisplayStyle = {
        "display": ""
      }
      var firstColText = (this.props.dataType === 'questionnaire' ? 'Item' : 'Assignment') + " name"
      if (this.props.dataType === 'questionnaire') {
        colWidthArray = ["30%", "0%", "0%", "0%", "20%", "20%", "30%"]
        colDisplayStyle = {
          "display": "none"
        }
      }  else if(this.props.dataType === 'course') {
        colWidthArray = ["20%", "0%", "0%", "20%", "20%", "20%", "20%"]
      }
      if (this.props.data) {
          if (this.props.dataType == 'course') {
              this.props.data.forEach(function (entry, i) {
                  _rows.push(<SimpleTableRow
                      key={entry.type + '_' + (parseInt(entry.nodeinfo.id) * 2).toString() + '_' + i}
                      id={entry.type + '_' + (parseInt(entry.nodeinfo.node_object_id) * 2).toString() + '_' + i}
                      name={entry.name}
                      institution={entry.institution}
                      creation_date={entry.creation_date}
                      updated_date={entry.updated_date}
                      private={entry.private}
                      actions={entry.actions}
                      is_available={entry.is_available}
                      course_id={entry.course_id}
                      max_team_size={entry.max_team_size}
                      is_intelligent={entry.is_intelligent}
                      allow_suggestions={entry.allow_suggestions}
                      require_quiz={entry.require_quiz}
                      has_topic={entry.has_topic}
                      dataType={_this.props.dataType}
                  />)
              })
          }
          else{
              this.props.data.forEach(function (entry, i) {
                  _rows.push(<SimpleTableRow
                      key={entry.type + '_' + (parseInt(entry.nodeinfo.id) * 2).toString() + '_' + i}
                      id={entry.type + '_' + (parseInt(entry.nodeinfo.node_object_id) * 2).toString() + '_' + i}
                      name={entry.name}
                      creation_date={entry.creation_date}
                      updated_date={entry.updated_date}
                      private={entry.private}
                      actions={entry.actions}
                      is_available={entry.is_available}
                      course_id={entry.course_id}
                      max_team_size={entry.max_team_size}
                      is_intelligent={entry.is_intelligent}
                      allow_suggestions={entry.allow_suggestions}
                      require_quiz={entry.require_quiz}
                      has_topic={entry.has_topic}
                      dataType={_this.props.dataType}
                  />)
              })
          }
      }
      if (this.props.dataType == 'course') {
          return (
              <table className="table table-hover">
                  <thead>
                      <tr>
                          <th width={colWidthArray[0]}>
                {firstColText}
                          </th>
                          <th style={colDisplayStyle} width={colWidthArray[3]}>
                              Institution
                          </th>
                          <th width={colWidthArray[4]}>
                              Creation Date
                          </th>
                          <th width={colWidthArray[5]}>
                              Updated Date
                          </th>
                          <th width={colWidthArray[6]}>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
            {_rows}
                  </tbody>
              </table>
          )
      }
      else{
          return (
              <table className="table table-hover">
                  <thead>
                      <tr>
                          <th width={colWidthArray[0]}>
                {firstColText}
                          </th>
                          <th width={colWidthArray[4]}>
                              Creation Date
                          </th>
                          <th width={colWidthArray[5]}>
                              Updated Date
                          </th>
                          <th width={colWidthArray[6]}>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
            {_rows}
                  </tbody>
              </table>
          )
      }
    }
  })

  var ContentTableRow = React.createClass({
    getInitialState: function() {
      return {
        expanded: false
      }
    },
    handleClick: function(event) {
        //alert('click');

      if (event.target.type != 'button') {
        this.setState({
          expanded: !this.state.expanded
        }, function() {
          this.props.rowClicked(this.props.id, this.state.expanded,this.props.newParams)
        })
      } else {
        event.stopPropagation()
      }
    },
    render: function () {
      var creation_date;
      var updated_date;
      var colWidthArray = ["30%", "0%", "0%", "0%", "25%", "25%", "20%"]
      var colDisplayStyle = {
        "display": "",
        "word-wrap":"break-word"
      }
      if (this.props.dataType === 'questionnaire') {
        colWidthArray = ["70%", "0%", "0%", "0%", "0%", "0%", "30%"]
        colDisplayStyle = {
          "display": "none"
        }
      } else if(this.props.dataType === 'course') {
        colWidthArray = ["20%", "0%", "0%", "20%", "20%", "20%", "20%"]
      }
      if (this.props.creation_date && this.props.updated_date) {
        creation = this.props.creation_date
        updated = this.props.updated_date

        creation_date = formatDate(new Date(creation))
        updated_date = formatDate(new Date(updated))

      }
      var nodeTypeRaw = this.props.id.split("_")[0]
      var nodeType = nodeTypeRaw.substring(0, nodeTypeRaw.length-4).toLowerCase()
      var id = this.props.id.split("_")[1]
      if (this.props.dataType == 'course') {
          var institution_name = "-"
            if(typeof this.props.institution !== 'undefined' && this.props.institution.length != 0){
              institution_name = this.props.institution[0].name
            }
          return (
              <tr onClick={this.handleClick} id={this.props.id}>
                  <td width={colWidthArray[0]}>{this.props.name}</td>
                  <td style={colDisplayStyle} width={colWidthArray[3]}>{institution_name}</td>
                  <td style={colDisplayStyle} width={colWidthArray[4]} dangerouslySetInnerHTML={{__html: creation_date}}></td>
                  <td style={colDisplayStyle} width={colWidthArray[5]} dangerouslySetInnerHTML={{__html: updated_date}}></td>
                  <td width={colWidthArray[6]}>
                      <RowAction
                          actions={this.props.actions}
                          key={this.props.id}
                          nodeType={nodeType}
                          parent_name={this.props.name}
                          private={this.props.private}
                          is_available={this.props.is_available}
                          course_id={this.props.course_id}
                          max_team_size={this.props.max_team_size}
                          is_intelligent={this.props.is_intelligent}
                          require_quiz={this.props.require_quiz}
                          allow_suggestions={this.props.allow_suggestions}
                          has_topic={this.props.has_topic}
                          dataType={this.props.dataType}
                          id={id}
                      />
                  </td>
              </tr>
          )
      }
      else{
          return (
              <tr onClick={this.handleClick} id={this.props.id}>
                  <td width={colWidthArray[0]}>{this.props.name}</td>
                  <td style={colDisplayStyle} width={colWidthArray[4]} dangerouslySetInnerHTML={{__html: creation_date}}></td>
                  <td style={colDisplayStyle} width={colWidthArray[5]} dangerouslySetInnerHTML={{__html: updated_date}}></td>
                  <td width={colWidthArray[6]}>
                      <RowAction
                          actions={this.props.actions}
                          key={this.props.id}
                          nodeType={nodeType}
                          parent_name={this.props.name}
                          private={this.props.private}
                          is_available={this.props.is_available}
                          course_id={this.props.course_id}
                          max_team_size={this.props.max_team_size}
                          is_intelligent={this.props.is_intelligent}
                          require_quiz={this.props.require_quiz}
                          allow_suggestions={this.props.allow_suggestions}
                          has_topic={this.props.has_topic}
                          dataType={this.props.dataType}
                          id={id}
                      />
                  </td>
              </tr>
          )
      }
    }
  })

  var ContentTableDetailsRow = React.createClass({
    render: function() {
      var colSpan = "5"
      var colDisplayStyle = {
        "display": ""
      }
      if (this.props.dataType === 'questionnaire') {
        colSpan = "6"
        colDisplayStyle = {
          "display": "none"
        }
      }
      var style;
      if (this.props.children && this.props.children.length > 0) {
        style = {
          display: this.props.showElement
        }
      } else {
        style = {
          display: "none"
        }
      }
      return (
        <tr style={style} className="active">
          <td style={colDisplayStyle}>
          </td>
          <td colSpan={colSpan}>
            <SimpleTable
             key={"simpletable_"+this.props.id}
             data={this.props.children}
             dataType={this.props.dataType}
            />
          </td>
        </tr>
      )
    }
  })

  var TitleRow = React.createClass({
    render: function() {
        return (
        <tr className="active">
            <td colSpan="6">
                <b>{this.props.title}</b>
            </td>
        </tr>
        )
    }
  })

  var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value
        );
    },
    render: function() {
        return (
          <span style={{"display": (this.props.dataType === 'questionnaire' ? "none" : "")}}>
              <input
                  type="text"
                  placeholder="Search..."
                  value={this.props.filterText}
                  ref="filterTextInput"
                  onChange={this.handleChange}
              />
          </span>
        );
    }
  })

  var FilterButton = React.createClass({
    handleChange: function() {
      this.props.onUserFilter(this.props.filterOption,
                              this.refs.filterCheckbox.getDOMNode().checked)
    },
    render: function() {
      return (
         <span className='show-checkbox' style={{"display": (this.props.dataType === 'questionnaire' ? "none" : "")}}>
           <input type="checkbox"
                  checked={this.props.inputCheckboxValue}
                  ref="filterCheckbox"
                  onChange={this.handleChange}>
             {" Include others' items"}
           </input>
         </span> 
      )
    }
  })

  var NewItemButton = React.createClass({
    render: function() {
      var renderContent = []
      var formStyle = {
        margin: 0,
        padding: 0,
        display: 'inline'
      }
      if (this.props.dataType.length > 0) {
        if (this.props.dataType != 'questionnaire') {
          renderContent.push(
            <form
              style={formStyle}
              action={"/"+(this.props.dataType === 'assignment' ? this.props.dataType+"s" : this.props.dataType)+"/new"}
              method="GET"
              key={this.props.dataType+"_new"+this.props.private.toString()}>
              <input type="hidden" name="private" value={this.props.private ? 1 : 0} />
              <button type="submit"
                      className="btn btn-primary pull-right new-button">
                     <b>+</b>
              </button>
            </form>
          )
        }
      }
      return (
        <span>
          {renderContent}
        </span>
      )
    }
  })

  var SortToggle = React.createClass({
    getInitialState: function() {
      return {
        order: this.props.order
      }
    },
    handleClick: function() {
      if (this.state.order === "normal") {
        this.setState({
          order: "reverse"
        }, function() {
          this.props.handleUserClick(this.props.colName, this.state.order)
        })
      } else {
        this.setState({
          order: "normal"
        }, function() {
          this.props.handleUserClick(this.props.colName, this.state.order)
        })
      }
    },
    render: function() {
      return (
        <span className="glyphicon glyphicon-sort" onClick={this.handleClick}></span>
      )
    }
  })

  var ContentTable = React.createClass({
    getInitialState: function() {
      return {
        expandedRow: []
      }
    },
    handleExpandClick: function(id, expanded,newParams) {
      if (expanded) {
        this.setState({ 
          expandedRow: this.state.expandedRow.concat([id])
        });
        if(this.props.dataType!='assignment') {
            _this = this;
            jQuery.post('/tree_display/children_node_2_ng',
                {
                    reactParams2: newParams
                },
                function (data) {
                    _this.props.data[id.split("_")[2]]['children'] = data;
                    _this.forceUpdate();
                }, 'json');
        }
      } else {
        var index = this.state.expandedRow.indexOf(id)
        if (index > -1) {
            var list = this.state.expandedRow;
            list.splice(index,1);
          this.setState({
            expandedRow: list
          })
        }
      }
    },
    handleSortingClick: function(colName, order) {
      this.props.onUserClick(colName, order)
    },
    render: function() {
      var _rows = []
      var _this = this
      var colWidthArray = ["30%", "0%", "0%", "0%", "25%", "25%", "20%"]
      var colDisplayStyle = {
        "display": ""
      }
      if (this.props) {
          if (this.props.dataType === 'questionnaire') {
              colWidthArray = ["70%", "0%", "0%", "0%", "0%", "0%", "30%"]
              colDisplayStyle = {
                  "display": "none"
              }
          }
          if (this.props.dataType == 'course') {
              colWidthArray = ["20%", "0%", "0%", "20%", "20%", "20%", "20%"]
              _rows.push(<TitleRow
                  title="My Courses"
              />)
          }
          else if(this.props.dataType=='assignment') {
              _rows.push(<TitleRow
                  title="My Assignments"
              />)
          }
          jQuery.each(this.props.data, function (i, entry) {
              if (((entry.name && entry.name.indexOf(_this.props.filterText) !== -1) ||
                  (entry.creation_date && entry.creation_date.indexOf(_this.props.filterText) !== -1) ||
                  (entry.institution && entry.institution.indexOf(_this.props.filterText) !== -1) ||
                  (entry.updated_date && entry.updated_date.indexOf(_this.props.filterText) !== -1)) &&
                  (entry.private == true || entry.type == 'FolderNode')) {
                  _rows.push(<ContentTableRow
                      key={entry.type+'_'+(parseInt(entry.nodeinfo.id)*2).toString()+'_'+i}
                      id={entry.type+'_'+(parseInt(entry.nodeinfo.node_object_id)*2).toString()+'_'+i}
                      name={entry.name}
                      institution={entry.institution}
                      creation_date={entry.creation_date}
                      updated_date={entry.updated_date}
                      actions={entry.actions}
                      is_available={entry.is_available}
                      course_id={entry.course_id}
                      max_team_size={entry.max_team_size}
                      is_intelligent={entry.is_intelligent}
                      require_quiz={entry.require_quiz}
                      dataType={_this.props.dataType}
                      //this is just a hack. All current users courses are marked as private during fetch for display purpose.
                      private={entry.private}
                      allow_suggestions={entry.allow_suggestions}
                      has_topic={entry.has_topic}
                      rowClicked={_this.handleExpandClick}
                      newParams={entry.newParams}
                  />)
                  _rows.push(<ContentTableDetailsRow
                      key={entry.type+'_'+(parseInt(entry.nodeinfo.id)*2+1).toString()+'_'+i}
                      id={entry.type+'_'+(parseInt(entry.nodeinfo.node_object_id)*2+1).toString()+'_'+i}
                      showElement={_this.state.expandedRow.indexOf(entry.type+'_'+(parseInt(entry.nodeinfo.node_object_id)*2).toString()+'_'+i) > -1 ? "" : "none"}
                      dataType={_this.props.dataType}
                      children={entry.children}
                  />)
              } else {
                  return;
              }
          })
          if (this.props.showPublic) {
              if (this.props.dataType == 'course') {
                  _rows.push(<TitleRow
                      title="Others' Public Courses"
                  />)
                  jQuery.each(this.props.data, function (i, entry) {
                      if (((entry.name && entry.name.indexOf(_this.props.filterText) !== -1) ||
                          (entry.creation_date && entry.creation_date.indexOf(_this.props.filterText) !== -1) ||
                          (entry.institution && entry.institution.indexOf(_this.props.filterText) !== -1) ||
                          (entry.updated_date && entry.updated_date.indexOf(_this.props.filterText) !== -1)) &&
                          (entry.private == false)) {
                          _rows.push(<ContentTableRow
                              key={entry.type + '_' + (parseInt(entry.nodeinfo.id) * 2).toString() + '_' + i}
                              id={entry.type + '_' + (parseInt(entry.nodeinfo.node_object_id) * 2).toString() + '_' + i}
                              name={entry.name}
                              institution={entry.institution}
                              creation_date={entry.creation_date}
                              updated_date={entry.updated_date}
                              actions={entry.actions}
                              is_available={entry.is_available}
                              course_id={entry.course_id}
                              max_team_size={entry.max_team_size}
                              is_intelligent={entry.is_intelligent}
                              require_quiz={entry.require_quiz}
                              dataType={_this.props.dataType}
                              private={entry.private}
                              allow_suggestions={entry.allow_suggestions}
                              has_topic={entry.has_topic}
                              rowClicked={_this.handleExpandClick}
                              newParams={entry.newParams}
                          />)
                          _rows.push(<ContentTableDetailsRow
                              key={entry.type + '_' + (parseInt(entry.nodeinfo.id) * 2 + 1).toString() + '_' + i}
                              id={entry.type + '_' + (parseInt(entry.nodeinfo.node_object_id) * 2 + 1).toString() + '_' + i}
                              showElement={_this.state.expandedRow.indexOf(entry.type + '_' + (parseInt(entry.nodeinfo.node_object_id) * 2).toString() + '_' + i) > -1 ? "" : "none"}
                              dataType={_this.props.dataType}
                              children={entry.children}
                          />)
                      } else {
                          return;
                      }
                  })
              }
              else if(this.props.dataType=='assignment') {
                  _rows.push(<TitleRow
                      title="Others' Public Assignments"
                  />)
                  jQuery.each(this.props.data, function (i, entry) {
                      if (((entry.name && entry.name.indexOf(_this.props.filterText) !== -1) ||
                          (entry.creation_date && entry.creation_date.indexOf(_this.props.filterText) !== -1) ||
                          (entry.updated_date && entry.updated_date.indexOf(_this.props.filterText) !== -1)) &&
                          (entry.private == false)) {
                          _rows.push(<ContentTableRow
                              key={entry.type + '_' + (parseInt(entry.nodeinfo.id) * 2).toString() + '_' + i}
                              id={entry.type + '_' + (parseInt(entry.nodeinfo.node_object_id) * 2).toString() + '_' + i}
                              name={entry.name}
                              creation_date={entry.creation_date}
                              updated_date={entry.updated_date}
                              actions={entry.actions}
                              is_available={entry.is_available}
                              course_id={entry.course_id}
                              max_team_size={entry.max_team_size}
                              is_intelligent={entry.is_intelligent}
                              require_quiz={entry.require_quiz}
                              dataType={_this.props.dataType}
                              private={entry.private}
                              allow_suggestions={entry.allow_suggestions}
                              has_topic={entry.has_topic}
                              rowClicked={_this.handleExpandClick}
                              newParams={entry.newParams}
                          />)
                          _rows.push(<ContentTableDetailsRow
                              key={entry.type + '_' + (parseInt(entry.nodeinfo.id) * 2 + 1).toString() + '_' + i}
                              id={entry.type + '_' + (parseInt(entry.nodeinfo.node_object_id) * 2 + 1).toString() + '_' + i}
                              showElement={_this.state.expandedRow.indexOf(entry.type + '_' + (parseInt(entry.nodeinfo.node_object_id) * 2).toString() + '_' + i) > -1 ? "" : "none"}
                              dataType={_this.props.dataType}
                              children={entry.children}
                          />)
                      } else {
                          return;
                      }
                  })
              }

      }

      }
      if (this.props.dataType == 'course') {
          return (
              <table className="table table-hover" style={{"table-layout": "fixed"}}>
                  <thead>
                      <tr>
                          <th width={colWidthArray[0]}>
                              Name
                              <SortToggle
                                  colName="name"
                                  order="normal"
                                  handleUserClick={this.handleSortingClick} />
                          </th>
                          <th style={colDisplayStyle} width={colWidthArray[3]}>
                              Institution
                              <SortToggle
                                  colName="institution"
                                  order="normal"
                                  handleUserClick={this.handleSortingClick} />
                          </th>
                          <th style={colDisplayStyle} width={colWidthArray[4]}>
                              Creation Date
                              <SortToggle
                                  colName="creation_date"
                                  order="normal"
                                  handleUserClick={this.handleSortingClick} />
                          </th>
                          <th style={colDisplayStyle} width={colWidthArray[5]}>
                              Updated Date
                              <SortToggle
                                  colName="updated_date"
                                  order="normal"
                                  handleUserClick={this.handleSortingClick} />
                          </th>
                          <th width={colWidthArray[6]}>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
            {_rows}
                  </tbody>
              </table>
          )
      }
       else{
          return (
              <table className="table table-hover" style={{"table-layout": "fixed"}}>
                  <thead>
                      <tr>
                          <th width={colWidthArray[0]}>
                              Name
                              <SortToggle
                                  colName="name"
                                  order="normal"
                                  handleUserClick={this.handleSortingClick} />
                          </th>
                          <th style={colDisplayStyle} width={colWidthArray[4]}>
                              Creation Date
                              <SortToggle
                                  colName="creation_date"
                                  order="normal"
                                  handleUserClick={this.handleSortingClick} />
                          </th>
                          <th style={colDisplayStyle} width={colWidthArray[5]}>
                              Updated Date
                              <SortToggle
                                  colName="updated_date"
                                  order="normal"
                                  handleUserClick={this.handleSortingClick} />
                          </th>
                          <th width={colWidthArray[6]}>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
            {_rows}
                  </tbody>
              </table>
          )
      }
    }
  })

  var FilterableTable = React.createClass({
    getInitialState: function() {
      return {
        filterText: '',
        privateCheckbox: false,
        publicCheckbox: false,
        tableData: this.props.data
      }
    },
    handleUserInput: function(filterText) {
      this.setState({
        filterText: filterText
      })
    },
    handleUserClick: function(colName, order) {
      var tmpData = this.state.tableData
      tmpData.sort(function(a, b) {
        var a_val = eval("a."+colName)
        var b_val = eval("b."+colName)
        if (order === 'normal') {
          if (!a_val && b_val) {
            return 1;
          }
          if (!b_val && a_val) {
            return -1;
          }
          if (!a_val && !b_val) {
            return 0;
          }
          return -(a_val.localeCompare(b_val))
        } else {
          if (!a_val && b_val) {
            return -1;
          }
          if (!b_val && a_val) {
            return 1;
          }
          if (!a_val && !b_val) {
            return 0;
          }
          return (a_val.localeCompare(b_val))
        }
      })
      this.setState({
        tableData: tmpData
      })
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({
        tableData: nextProps.data
      })
    },
    handleUserFilter: function(name, checked) {
      var publicCheckboxStatus = this.state.publicCheckbox
        publicCheckboxStatus = checked
      var tmpData = this.props.data.filter(function(element) {
          if(publicCheckboxStatus){
              return true
          }
          else
            return element.private===true
      })
        this.setState({
          tableData: tmpData,
          publicCheckbox: publicCheckboxStatus
        })
    },
    render: function() {
      return (
        <div className="filterable_table">
          <SearchBar
            filterText={this.state.filterText}
            onUserInput={this.handleUserInput}
            dataType={this.props.dataType}
          />
          <FilterButton
            filterOption="public"
            onUserFilter={this.handleUserFilter}
            inputCheckboxValue={this.state.publicCheckbox}
            dataType={this.props.dataType}
          />
          <NewItemButton
            dataType={this.props.dataType}
            private={true}
          />
          <ContentTable
            data={this.state.tableData}
            filterText={this.state.filterText}
            onUserClick={this.handleUserClick}
            dataType={this.props.dataType}
            showPublic={this.state.publicCheckbox}
          />
        </div>
      )
    }
  })

  var TabSystem = React.createClass({
    getInitialState: function() {
      return {
        tableContent: {
          Courses: {},
          Assignments: {},
          Questionnaires: {}
        },
        activeTab: "1"
      }
    },
    componentWillMount: function() {
      var _this = this
      preloadImages('/assets/tree_view/edit-icon-24.png',
                    '/assets/tree_view/delete-icon-24.png',
                    '/assets/tree_view/lock-off-disabled-icon-24.png',
                    '/assets/tree_view/lock-disabled-icon-24.png',
                    '/assets/tree_view/Copy-icon-24.png',
                    '/assets/tree_view/add-public-24.png',
                    '/assets/tree_view/add-private-24.png',
                    '/assets/tree_view/add-ta-24.png',
                    '/assets/tree_view/add-assignment-24.png',
                    '/assets/tree_view/add-participant-24.png',
                    '/assets/tree_view/create-teams-24.png',
                    '/assets/tree_view/360-dashboard-24.png',
                    '/assets/tree_view/remove-from-course-24.png',
                    '/assets/tree_view/assign-course-blue-24.png',
                    '/assets/tree_view/run-lottery.png',
                    '/assets/tree_view/assign-reviewers-24.png',
                    '/assets/tree_view/assign-survey-24.png',
                    '/assets/tree_view/view-survey-24.png',
                    '/assets/tree_view/view-scores-24.png',
                    '/assets/tree_view/view-review-report-24.png',
                    '/assets/tree_view/view-suggestion-24.png',
                    '/assets/tree_view/view-delayed-mailer.png',
                    '/assets/tree_view/view-publish-rights-24.png'
                    )
      jQuery.get("/tree_display/session_last_open_tab", function(data) {
        _this.setState({
          activeTab: data
        })
      })
      jQuery.get("/tree_display/folder_node_ng_getter", function(data) {
        jQuery.post("/tree_display/children_node_ng",
          {
            reactParams: {
              child_nodes: data,
              nodeType: 'FolderNode'
            }
          }, function(data2, status) {
            jQuery.each(data2, function(nodeType, outerNode) {
              jQuery.each(outerNode, function(i, node) {
                var newParams = {
                  key: node.name + "|" + node.directory,
                  nodeType: nodeType,
                  child_nodes: node.nodeinfo
                }
                if (nodeType === 'Assignments') {
                  node["children"] = null;
                  node[newParams]=newParams;
                } else if (nodeType === 'Courses') {
                  newParams["nodeType"] = 'CourseNode'
                  node["newParams"]=newParams;
                } else if (nodeType === 'Questionnaires') {
                  newParams["nodeType"] = 'FolderNode'
                  node["newParams"]=newParams;
                }
              }) 
            })
            if (data2) {
              _this.setState({
                tableContent: data2
              })
            }
          },
          'json')
      })
      
    },
    handleTabChange: function(tabIndex) {
      jQuery.get("/tree_display/set_session_last_open_tab?tab="+tabIndex.toString())
    },
    render: function() {
      return (
        <ReactSimpleTabs
         className="tab-system"
         tabActive={parseInt(this.state.activeTab)}
         onAfterChange={this.handleTabChange}
         >
          <ReactSimpleTabs.Panel title="Courses">
            <FilterableTable key="table1" dataType='course' data={this.state.tableContent.Courses}/>
          </ReactSimpleTabs.Panel>
          <ReactSimpleTabs.Panel title="Assignments">
            <FilterableTable key="table2" dataType='assignment' data={this.state.tableContent.Assignments}/>
          </ReactSimpleTabs.Panel>
          <ReactSimpleTabs.Panel title="Questionnaires">
            <FilterableTable key="table2" dataType='questionnaire' data={this.state.tableContent.Questionnaires}/>
          </ReactSimpleTabs.Panel>
        </ReactSimpleTabs>
      )
    }
  })

  if (document.getElementById("tree_display")) {
    React.render(
      React.createElement(TabSystem),
      document.getElementById("tree_display")
    )
  }

})
