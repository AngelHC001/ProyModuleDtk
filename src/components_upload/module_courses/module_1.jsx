import React,{ useState, useEffect } from 'react';
import CoursesList from './courses_list';
import CoursesForm from './courses_form';
import '../../assets/utils/c-estilos.css';

//MODULE ONE: JUNTA COURSESFORM Y COURSESLIST PARA LA PESTAÑA CREAR CARPETA
const INITIAL_ST = {id:'',sigla:'',name:'',year:''}

const ModuleOne = () => {
  const [courses, setCourses] = useState([]);
  const [selected,setSelected] = useState(INITIAL_ST);
  const [loading, setLoading] = useState(true);

  //LEER PHP
  const loadCourses = async () => {
    try {
      const response = await fetch(`/api/courses.php`);
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } 
    catch (error) {
      console.error("Error cargando cursos", error);
    }
  };

  const handleSelect = (course) =>{
    setSelected({...INITIAL_ST,...course});
  }

  useEffect(() => {
    return () => loadCourses();
  }, []);

  return (
    <div className="row d-flex justify-content-center text-center gap-4 p-auto mb-4">
      <CoursesForm key={selected.key} actualCourse={selected} onActionEnded={() => {loadCourses(); setSelected(INITIAL_ST); }}/>  
      {loading ? <h6>Cargando Registros</h6> : <CoursesList listDir={courses} onSelect={handleSelect}/>    }
    </div>
  );
};

export default ModuleOne;