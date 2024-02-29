$(function () {

    $("#nome").on("input", function () {
        let valor = $(this).val();
        if(valor ==="")
        {
            $(".nome").text("Seu Nome");
        }
        else
        {
            
            $(".nome").text($(this).val().toUpperCase());
        }    
    });

    $("#cargo").on("input", function () {
        $(".cargo").text($(this).val().toUpperCase());
    });

    $("#setor").on("input", function () {
        $(".setor").text($(this).val());
    });


    $(".baixar").on("click", function (e) {
        gerarImagem($(".nome").text());
    });

    


    
    const buttonRecortar = document.getElementById('button_recortar');

    const ulrUF = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/';
    const uf = document.getElementById('setor');
    const cidade = document.getElementById('cargo');
    


    uf.addEventListener('change', async function(){
        const urlCidades = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+uf.value+'/municipios'
        const request = await fetch(urlCidades);
        const response = await request.json();
        let options = '';
        response.forEach(function(cidades){
            options += '<option>'+cidades.nome+'</option>'
        })
        cidade.innerHTML = options;
    })
    

    window.addEventListener('load', async()=>{
        const request = await fetch(ulrUF);
        const response = await request.json();
       

        const options = document.createElement("optgroup")
        options.setAttribute('label','UFs')
        response.forEach(function(uf){
            options.innerHTML += '<option>' + uf.sigla + '</options>'
        })
        uf.append(options);
    })

    function crop(image)
    {
        return new Cropper(image, {
            viewMode: 1,
            aspectRatio: 3 / 4,
            cropBoxResizable:true,
            preview:'#img-preview',
            background:true,
            // data:{
            //     width:300,
            //     height:400,
            // }

        })
    }

    
    
    // ESSA FUNÇÃO É PARA GERAR A IMAGEM PARA BAIXAR BASICAMENTE
    function gerarImagem(nome) {
        window.devicePixelRatio = 2;
        html2canvas(document.querySelector('.sign-container'), {
            width: 400,
            height: 700,
            backgroundColor: null,
            scale: 3
        }).then(function (canvas) {
            var name = 'assinatura-' + nome.toLowerCase().replace(" ", "-");
            let a = document.createElement('a');
            a.href = canvas.toDataURL("image/png", 1.0);
            a.download = name + '.png';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
    }
    
    
    
    // mostra o preview da imagem selecionada
    function previewImageUpload(fileInput) {
        const input = document.querySelector(fileInput);
        let file = input.files[0];
        
        if (file.size > 113145728) {
            $(".msg").addClass("on");
            $(".msg .text").text("Escolha uma imagem menor que 3MB");
            return false;
        }
        if (!file) return false;
        return URL.createObjectURL(file);
    }
    
    
    
    let cropper;
    //onde coloca a imagem no site
    $("#uploadPhoto").on("change", function () {
        const urlImage = previewImageUpload("#uploadPhoto");
        const imgPreview = $(".img-preview");
        const imgAssinatura = $(".img-assinatura");
        
        if (!urlImage) return;
        
        imgPreview.attr("src", urlImage);
        //aonde implantei o cropper     
        setTimeout(()=>{ 
            if(cropper)
            {
                cropper.destroy();
            }
            cropper = crop($(".img-preview")[0]);
            let privewCrop = document.querySelector("#img-assinatura");
            
            $(".delete").css("display", "block");
            buttonRecortar.addEventListener('click', event =>{
                
                let croppedCanvas = cropper.getCroppedCanvas(
                    {
                        width:300,
                        height:400,
                    }
                    );
                    cropper.destroy();
                    let croppedImage = croppedCanvas.toDataURL();
                    imgAssinatura.attr("src", croppedImage); 
                    $(".delete").css("display", "none");
                })
                
            },200)

            $(".delete").addClass("active");
            $(".add-foto .text").text("Alterar foto");  
            
        });

        $(".delete").click(function(){
            
            
            const imgPreview = $(".img-preview");
            const imgAssinatura = $(".img-assinatura");
            var baseImage = "./assets/img/profile.png";
            var signatureImage = "./assets/img/model-profile.png";
            
        
            
            imgPreview.attr("src", baseImage);
            imgAssinatura.attr("src", signatureImage);
            $("#uploadPhoto").val("");
            $(this).removeClass("active");
            $(".add-foto .text").text("Adicionar foto");
            
            if(cropper)
            {
                cropper.destroy();
                cropper = null;
            }
        });
        
        // define as máscaras de formulário
        var SPMaskBehavior = function (val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        },
        spOptions = {
            onKeyPress: function (val, e, field, options) {
                field.mask(SPMaskBehavior.apply({}, arguments), options);
            }
        };
        
    $('.mask-phone').mask(SPMaskBehavior, spOptions);
    
});




//criei aqui uma mask para caracteres do nome da pessoa

let nome = document.getElementById('nome');
let spanAlert = document.createElement('span');

function alertCaracter(nome)
{
    let alert = document.querySelector('.alert');
    let numb_string = nome.value.length;
    if(numb_string == 20)
    {
        nome.style.borderColor ="red";
        spanAlert.style.color ='red';
        spanAlert.style.fontSize = "10px";
        spanAlert.innerHTML = "você chegou no limite de 20 caracteres";
        if(!spanAlert.parentNode)
        {
            alert.insertAdjacentElement("afterend", spanAlert); 
        }
    }else{
        nome.style.borderColor ="gray";
        if(spanAlert.parentNode)
        {
            spanAlert.remove();
        }
    }
}



nome.addEventListener('input', function(){
    alertCaracter(nome);
})

let ButtonDelete = document.querySelector('.delete');






// const reader = new FileReader;

// reader.onload = function(Event)
// {
//     const previewImage = document.createElement('img');
//     previewImage.Id = 'preview-image';
//     previewImage.src = Event.target.result;
//     h2Avatar.insertAdjacentElement('afterend', previewImage);
// }

// reader.readAsDataURL(avatarImage.files[0]);