// Stroop task example with lab.js
// Initial implementation by Felix Henninger



// Define a template for a stroop trial
var encodingTemplate = new lab.flow.Sequence({
  datacommit: false,
  content: [
    // Fixation cross ----------------------------------------------------------
    // This screen uses the trial page template,
    // but substitutes a gray plus as a fixation cross
    new lab.html.Screen({
      contentUrl: 'pages/3-trial.html',
      parameters: {
        color: 'black',
        word: '+',
        weight: 'normal',
      },
      // Don't log data from this screen
      datacommit: false,
      // Display the fixation cross for 500ms
      timeout: 500,
    }),
    // Trial screen ------------------------------------------------------------
    // This is the central screen in the experiment:
    // the display that participants respond to.
    new lab.html.Screen({
      // This screen is assigned a title,
      // so that we can recognize it more easily
      // in the dataset.
      //datacommit: false,
      title: 'Encoding',
      // Again, we use the trial page template
      contentUrl: 'pages/3-trial.html',
      parameters: {
        // Color and displayed word
        // are determined by the trial
        color: 'black',
        weight: 'normal',
        fontfamily: 'Courier New',
      },
      // Each possible color response is
      // associated with a key
      // responses: {
      //   'keypress(r)': 'red',
      //   'keypress(g)': 'green',
      //   'keypress(b)': 'blue',
      //   'keypress(o)': 'orange',
      // },
      // The display terminates after 1500ms
      timeout: 1500,
      // Because the color is set dynamically,
      // we need to set the correct response by hand
     /* messageHandlers: {
        'before:prepare': function() {
          // Set the correct response
          // before the component is prepared
          this.options.correctResponse = this.aggregateParameters.color
        },
      }*/
    }),
    // Feedback (or empty) screen ----------------------------------------------
    /*new lab.html.Screen({
      contentUrl: 'pages/3-trial.html',
      parameters: {
        color: 'gray',
        word: '', // This is a placeholder, we generate the word below
        weight: 'normal',
      },
      datacommit: false,
      // Because feedback can only be given after
      // the choice has been recorded, this component
      // is prepared at the last possible moment.
      tardy: true,
      // Generate feedback
      messageHandlers: {
        'before:prepare': function() {
          if (this.aggregateParameters.feedback) {
            // Generate feedback if requested
            this.options.timeout = 1000

            // First, check if the participant responded in time at all
            if (this.options.datastore.state['ended_on'] === 'response') {
              // If there is a response, check its veracity
              if (this.options.datastore.state['correct'] === true) {
                this.options.parameters.word = 'Well done!'
              } else {
                this.options.parameters.word = 'Please respond as quickly and accurately as you can!'
              }
            } else {
              // If no response was given, poke participants to speed up
              this.options.parameters.word = 'Can you go faster?'
            }
          } else {
            // If no feedback is shown, shorten the inter-trial interval
            this.options.timeout = 500
          }
        }
      },
    }),*/
    // Confidence ratings ----------------------------------------------------------
    // This screen uses the trial page template,
    // but substitutes a gray plus as a fixation cross
/*    new lab.html.Screen({
      contentUrl: 'pages/3-trial.html',
      parameters: {
        color: 'black',
        word: '1  --  2 -- 3 -- 4 -- 5 -- 6 ',
        weight: 'normal',
      },
      // Don't log data from this screen
      //datacommit: false,
      responses: {
        'keypress(q)': '1',
        'keypress(w)': '2',
        'keypress(e)': '3',
        'keypress(r)': '4',
        'keypress(t)': '5',
        'keypress(y)': '6',

      },
      // The display terminates after 1500ms
     // timeout: 1500,
      // Because the color is set dynamically,
      // we need to set the correct response by hand
      messageHandlers: {
        'before:prepare': function() {
          // Set the correct response
          // before the component is prepared
          this.options.correctResponse = this.aggregateParameters.color
        },
      }
    }),*/
  ]
})

// Test trial

var testTemplate = new lab.flow.Sequence({
  datacommit: false,
  content: [
    // Trial screen ------------------------------------------------------------
    // This is the central screen in the experiment:
    // the display that participants respond to.
    new lab.html.Screen({
      // This screen is assigned a title,
      // so that we can recognize it more easily
      // in the dataset.
      //datacommit: false,
      title: 'Test',
      // Again, we use the trial page template
      contentUrl: 'pages/3b-test.html',
      parameters: {
        // Color and displayed word
        // are determined by the trial
        weight: 'normal',
        fontfamily: 'Courier New',
      },
      // Each possible color response is
      // associated with a key
      responses: {
        'keypress(1)': '1',
        'keypress(2)': '2',
        'keypress(3)': '3',
        'keypress(4)': '4',
        'keypress(5)': '5',
        'keypress(6)': '6',

      },
      // The display terminates after 1500ms
      //timeout: 1500,
      // Because the color is set dynamically,
      // we need to set the correct response by hand
      /* messageHandlers: {
         'before:prepare': function() {
           // Set the correct response
           // before the component is prepared
           this.options.correctResponse = this.aggregateParameters.color
         },
       }*/
    }),
  ]
})

// Define the trials:

var trials = [];
for(var ind = 0; ind < items.length; ind++)
  trials.push({
    word: items[ind]
  });

numberitems = [...Array(trials.length).keys()];
numberold = Math.floor(trials.length/2);

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
olditems = getRandom(numberitems,numberold)

trials.forEach(function (item, index) {
    if(olditems.includes(index))
        trials[index].state = 'old';
    else
        trials[index].state = 'new';
});

var studytrials =  trials.filter(function(trial) {
    return trial.state === 'old';
});


// With the individual components in place,
// now put together the entire experiment
var experiment = new lab.flow.Sequence({
  // pavlovia plugin
  plugins: [ new Pavlovia() ],
  datacommit: false,
  content: [
    // Initial instructions
    new lab.html.Screen({
      contentUrl: 'pages/1-welcome.html',
      datacommit: false,
      responses: {
        'keypress(Space)': 'continue'
      },
    }),
    new lab.html.Form({
      contentUrl: 'pages/0-demographics.html',
      content: '<form>' +
          '<input type="number" name="age" id="participant-age">' +
          '<input type="text" name="gender" id="participant-gender">' +
          '<button type="submit">Submit and continue</button>' +
          '</form>'
    }),
    // Instruction summary
    new lab.html.Screen({
      contentUrl: 'pages/2a-studyphaseIntro.html',
      datacommit: false,
      responses: {
        'keypress(Space)': 'continue'
      },
    }),
    // Encoding Phase
    new lab.flow.Loop({
      template: encodingTemplate,
      templateParameters: studytrials,
      shuffle: true,
      parameters: {
        Phase: 'Encoding',
      },
    }),
    // Interlude
    new lab.html.Screen({
      contentUrl: 'pages/4-interlude.html',
      responses: {
        'keypress(Space)': 'continue',
      },
    }),
    // Test Phase
    new lab.flow.Loop({
      template: testTemplate,
      templateParameters: trials,
      shuffle: true,
      parameters: {
        Phase: 'Test',
      },
    }),
    // Thank-you page
    new lab.html.Screen({
      contentUrl: 'pages/5-thanks.html',
      // Respond to clicks on the download button
      events: {
        'click button#download': function() {
         // this.options.datastore.download()
          this.end();
        },
      },
    }),
  ],
  datastore: new lab.data.Store()

});

// Go!
experiment.run();