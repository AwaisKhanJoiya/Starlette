/**
 * Service for handling admin-related API operations
 */

const API_BASE_URL = "/api/admin";

/**
 * Helper to handle API responses
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
};

/**
 * Get all classes with pagination
 */
export const getAllClasses = async (page = 1, limit = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/classes?page=${page}&limit=${limit}`
  );
  return handleResponse(response);
};

/**
 * Get a class by ID
 */
export const getClassById = async (classId) => {
  const response = await fetch(`${API_BASE_URL}/classes/${classId}`);
  return handleResponse(response);
};

/**
 * Create a new class
 */
export const createClass = async (classData) => {
  const response = await fetch(`${API_BASE_URL}/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(classData),
  });
  return handleResponse(response);
};

/**
 * Update an existing class
 */
export const updateClass = async (classId, classData) => {
  const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(classData),
  });
  return handleResponse(response);
};

/**
 * Delete a class
 */
export const deleteClass = async (classId) => {
  const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

/**
 * Get all users registered for a class
 */
export const getClassEnrollments = async (classId) => {
  const response = await fetch(
    `${API_BASE_URL}/classes/${classId}/enrollments`
  );
  return handleResponse(response);
};

/**
 * Update enrollment status
 */
export const updateEnrollmentStatus = async (classId, userId, status) => {
  const response = await fetch(
    `${API_BASE_URL}/classes/${classId}/enrollments/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );
  return handleResponse(response);
};
