





const extensions = 
{
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
}

function createButton(textContent)
{
    const button = document.createElement('button');
    button.textContent = textContent;
    return button;
}

function crop(image)
{
    return new Cropper(image, {
        dragMode:'move',
        preview:'#preview-crop',background:false,
        
    })
}



const avatarImage = document.querySelector('#avatar-image');
const h2Avatar = document.querySelector('#h2-avatar');



avatarImage.addEventListener('change', event =>{
    const preview = document.querySelector('#preview-image');
    const previewImage = document.createElement('img');
    if (preview)
    {
        preview.remove();
    }

    const reader = new FileReader;

   

    reader.onload = function(event)
    {
        
        previewImage.id = 'preview-image';
        previewImage.src = event.target.result;
        h2Avatar.insertAdjacentElement('afterend', previewImage)

    }
    reader.readAsDataURL(avatarImage.files[0])
    setTimeout(() =>{
        let cropper = crop(previewImage);
        let previewCrop = document.querySelector('#preview-crop');
        previewCrop.style ='display:block';

        const removeCropButton = createButton('Remove Crop');
        const uploadButton = createButton('Upload');

        h2Avatar.insertAdjacentElement('afterend', removeCropButton)
        h2Avatar.insertAdjacentElement('afterend', uploadButton);
        h2Avatar.insertAdjacentElement('afterend', rotateButton);

        removeCropButton.addEventListener('click', event =>{
            cropper.destroy();
            removeCropButton.remove();
            uploadButton.remove();
            previewImage.remove();
            previewCrop.style = 'display:none';
        })
        uploadButton.addEventListener('click', event =>{
            if(cropper.cropped)
            {
                cropper.getCroppedCanvas().toBlob(async blo =>{
                    try{
                        const formData = new FormData;
                        formData.append('file',blob);
                        formData.append('extension', extensions[blob.type]);

                    const response = await fetch('http://localhopst:8000',{
                        method:'post',
                        body:formData
                    })  


                    }catch(error){
                        
                    }
                })
            }else
            {

            }
        })

    },200)
})



