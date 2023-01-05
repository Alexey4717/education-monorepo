import {CourseOutputModel} from "./CourseOutputModel";

export type GetCoursesQueryModel = {
    /**
     * this title need for filtering and searching courses by title
     */
    title: CourseOutputModel["title"]
}