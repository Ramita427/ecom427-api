import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { removeFiles, uploadFiles } from '../../api/product'
import useEcomStore from '../../store/ecom-store'
import { Loader } from 'lucide-react';
const Uploadfile = ({ form, setForm }) => {
    const token = useEcomStore((state) => state.token)
    const [isLoading, setIsLoading] = useState(false)
    const handleOnChange = (e) => {
    const files = e.target.files
    if (files) {
        setIsLoading(true)
        for (let i = 0; i < files.length; i++) {

            const file = files[i]
            if (!file.type.startsWith('image/')) {
                toast.error(`File ${file.name} บ่แม่นรูป`)
                continue
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 720;  // กำหนดความกว้างสูงสุดตามโค้ดเดิมของคุณ
                    const MAX_HEIGHT = 720; // กำหนดความสูงสูงสุดตามโค้ดเดิมของคุณ
                    let width = img.width;
                    let height = img.height;
                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const base64Data = canvas.toDataURL('image/jpeg', 1.0);
                    uploadFiles(token, { image: base64Data })
                        .then((res) => {
                            console.log(res)
                            setForm((prevForm) => ({
                                ...prevForm,
                                images: [...prevForm.images, res.data]
                            }))
                            setIsLoading(false)
                            toast.success('Upload image Success!!!')
                        })
                        .catch((err) => {
                            console.log(err)
                            setIsLoading(false)
                        })
                };
            };
        }
    }
}

    const handleDelete = (public_id) => {
        const images = form.images
        removeFiles(token, public_id)
            .then((res) => {
                const filterImages = images.filter((item) => {
                    console.log(item)
                    return item.public_id !== public_id
                })
                console.log('filterImages', filterImages)
                setForm({
                    ...form,
                    images: filterImages
                })
                toast.error(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <div className='my-4'>
            <div className='flex mx-4 gap-4 my-4'>
                {
                    isLoading && <Loader className='w-16 h-16 animate-spin' />
                }

                {
                    form.images.map((item, index) =>
                        <div className='relative' key={index}>
                            <img
                                className='w-24 h-24 hover:scale-105'
                                src={item.url} />
                            <span
                                onClick={() => handleDelete(item.public_id)}
                                className='absolute top-0 right-0 bg-red-500 p-1 rounded-md'>X</span>
                        </div>
                    )
                }
            </div>
            <div>
                <input
                    onChange={handleOnChange}
                    type='file'
                    name='images'
                    multiple
                />
            </div>
        </div>
    )
}


export default Uploadfile