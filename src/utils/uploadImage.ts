export const uploadImageFile = async (file: File): Promise<string | null> => {
  try {
    const imgData = new FormData();

    imgData.append("photo", file);

    const response = await fetch(
      `https://cheffy-server.vercel.app/api/image-upload/`,
      {
        method: "POST",
        body: imgData,
        credentials: "include",
      },
    );

    if (!response.ok) {
      const errorData = await response.text();

      console.error("Server Error Response:", errorData);
      throw new Error("Image upload failed with status " + response.status);
    }

    const data = await response.json();

    return data.data.path || data.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);

    return null;
  }
};
