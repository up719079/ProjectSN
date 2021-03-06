window.onload = function() {
  get('/university', populateUniversities);
};

var populateUniversities = function (results) {
  var university = document.getElementById('university')
  university.innerHTML = "";
  results.forEach(function (result) {
    option = document.createElement('option');
    option.value = result['id'];
    option.innerHTML = result['name'];
    university.appendChild(option);
  });
  var selected = university.options[university.selectedIndex].value;
  get(`/university/${selected}/courses`, populateCourses);
};

var populateCourses = function (results) {
  var course = document.getElementById('course')
  course.innerHTML = "";
  results.forEach(function (result) {
    option = document.createElement('option');
    option.value = result['id'];
    option.innerHTML = result['name'];
    course.appendChild(option);
  });
};

var newUser = function (fname, surname, email, university, course, bio, privacy) {
  post('/user', {
    fname:fname,
    surname:surname,
    email:email,
    university:university,
    course:course,
    bio:bio,
    privacy:privacy
  });
};

var newDebugUser = function (fname, surname, email, university, course, bio, privacy) {
  post('/debug/user', {
    fname:fname,
    surname:surname,
    email:email,
    university:university,
    course:course,
    bio:bio,
    privacy:privacy
  });
};

var newGroup = function (name, description, university, course, isprivate, isunit) {
  post('/group', {
    name:name,
    university:university,
    course:course,
    description:description,
    isprivate:isprivate,
    isunit:isunit
  });
};

var newCourse = function (name, description) {
  post('/course', {
    name:name,
    description:description
  });
};


var uploadPicture = function (picture) {
  var url = getUrlVars();
  var data = new FormData();
  data.append('picture', picture);
  upload(`/picture/${url['id']}`, data);
}
