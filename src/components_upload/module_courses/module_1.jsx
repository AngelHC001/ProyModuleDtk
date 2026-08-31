import React from 'react';
import CoursesList from './courses_list';
import CoursesForm from './courses_form';
import '../../assets/utils/c-estilos.css';


//MODULE ONE: JUNTA COURSESFORM Y COURSESLIST

const ModuleOne = () => {

  /*
  const [courses, setCourses] = useState([]);
  const [selected,setSelected] = useState(INITIAL_ST);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelect = (course) =>{
    setSelected({...INITIAL_ST,...course});
  }

  //Disparará el useEffect
  const reloadCourses = () => {
      setRefreshTrigger(prev => prev + 1);
  };


  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    
    const loadCourses = async () => {
      setLoading(true);
      try {    
        const response = await fetch(`${url}/m1_courses.php`,{ method:'GET', signal:signal });
        if (!response.ok) {
              throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        if (!signal.aborted) { setCourses(data); }
      } 
      catch (error) {
        console.error("Error cargando cursos", error);
      }
      finally{
        if (!signal.aborted) { setLoading(false); }
      }
    }

    loadCourses();
    return () => controller.abort(); 
  },[refreshTrigger]);
  */
  return (
    <div className="row d-flex justify-content-center text-center gap-4 p-auto mb-4">
      <CoursesForm/>  
      <CoursesList/>    
    </div>
  );
}

export default ModuleOne;