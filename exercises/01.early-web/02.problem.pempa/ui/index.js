// 🐨 Add an event listener for 'DOMContentLoaded'
// Inside the event listener:
// 🐨 Get the form element with the id 'counter-form'
// 🐨 Add a submit event listener to the form

// In the form submit event listener:
// 🐨 Prevent the default form submission behavior
// 🐨 Create a new FormData object from the form
// 🐨 If there's an event.submitter, append the submitter's name and value to the FormData
// 🐨 set the div with the id of "counter-buttons" to have an opacity of 0.6
// 🐨 Get the form's action URL and method
// 🐨 Send a fetch request to the action URL with the form data
// 🐨 If the response is successful:
//    - Parse the JSON response to get the new count
//    - Update the inner text of the element with id 'count' to display `Count: ${count}`
// 🐨 If the response fails, log an error to the console
// 🐨 set the div with the id of "counter-buttons" to have an opacity of 1.

// 💰 Make sure to handle asynchronous operations properly using async/await
// 💰 Make certain the buttons' opacity is set back to 1 regardless of the result
