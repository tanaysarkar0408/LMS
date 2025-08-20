import Course from "../models/Course.js";
import mongoose from 'mongoose';

// const { ObjectId } = mongoose.Types;

//Get all courses

// export const getAllCourses = async (req,res) => {
//     console.log('getAllCourses called from courseController page');
//     try {
//         const courses = await Course.find({isPublished : true}).populate({path:'educator'})

            
//         res.json({success : true,courses})
//     } catch (error) {
//         res.json({success : false,message : error.message})
//     }
// }

export const getAllCourses = async (req,res) => {
    console.log('getAllCourses called from courseController page');
    try {
        // Log collection info
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        const courses = await Course.find({isPublished : true}).populate({path:'educator'});
        console.log('Found courses count:', courses.length);
        if (courses.length > 0) {
            console.log('Sample course ID:', courses[0]._id);
            console.log('Sample course ID type:', typeof courses[0]._id);
        }
            
        res.json({success : true, courses});
    } catch (error) {
        console.error('Error in getAllCourses:', error);
        res.json({success : false, message: error.message});
    }
}
// Get course byId

// export const getCourseId = async (req, res) => {
//     console.log('getCourseId called from courseController page with ID:', req.params.id);
//     const {id} = req.params;
//     try {
//         console.log('Trying to find course with ID:', id);
        
//         // First try with ObjectId conversion since we know that's how it's stored
//         let course;
//         if (mongoose.Types.ObjectId.isValid(id)) {
//             course = await Course.findById(id).populate('educator');
//             console.log('ObjectId query result:', course ? 'Found' : 'Not found');
//         }

//         // If not found, try direct string match (just in case)
//         if (!course) {
//             console.log('Trying string match...');
//             course = await Course.findOne({ _id: id }).populate('educator');
//         }

//         if (!course) {
//             console.log('Course not found with any method');
//             return res.status(404).json({ 
//                 success: false, 
//                 message: "Course not found" 
//             });
//         }

//         console.log('Found course:', {
//             id: course._id,
//             title: course.courseTitle,
//             contentLength: course.courseContent?.length
//         });

//         // Process course content
//         if (course.courseContent?.length) {
//             course.courseContent.forEach(chapter => {
//                 chapter.chapterContent?.forEach(lecture => {
//                     if (!lecture.isPreviewFree) {
//                         lecture.lectureUrl = '';
//                     }
//                 });
//             });
//         }

//         return res.json({ 
//             success: true, 
//             courseData: course 
//         });

//     } catch (error) {
//         console.error('Error in getCourseId:', error);
//         return res.status(500).json({ 
//             success: false, 
//             message: "Error fetching course: " + error.message 
//         });
//     }
// }



  

export const getCourseId = async (req, res) => {
    console.log('getCourseId called with ID:', req.params.id);
    const { id } = req.params;
    
    try {
        console.log('Searching for course with ID:', id);
        
        // Use findOne with _id as string since that's what works in your database
        const courseData = await Course.findOne({ _id: id }).populate({path: 'educator'});
        console.log('Found course:', courseData ? courseData._id : 'Not found');

        if (!courseData) {
            console.log('Course not found in database');
            return res.status(404).json({ 
                success: false, 
                message: "Course not found" 
            });
        }

        // Process course content if needed
        if (courseData.courseContent && Array.isArray(courseData.courseContent)) {
            courseData.courseContent.forEach(chapter => {
                if (chapter && chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
                    chapter.chapterContent.forEach(lecture => {
                        if (lecture && typeof lecture.isPreviewFree !== 'undefined' && !lecture.isPreviewFree) {
                            lecture.lectureUrl = '';
                        }
                    });
                }
            });
        }

        return res.json({ 
            success: true, 
            courseData 
        });

    } catch (error) {
        console.error('Error in getCourseId:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Error fetching course: " + error.message 
        });
    }
}