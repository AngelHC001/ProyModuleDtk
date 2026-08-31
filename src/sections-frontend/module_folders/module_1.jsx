import React from 'react';
import CoursesList from './courses_list';
import CoursesForm from './courses_form';
import '../../assets/utils/c-estilos.css';

//MODULE ONE: JUNTA COURSESFORM Y COURSESLIST
const ModuleOne = () => {
  return (
    <div className="row d-flex justify-content-center text-center gap-4 p-auto">
      <CoursesForm/>  
      <CoursesList/>    
    </div>
  );
}

export default ModuleOne;