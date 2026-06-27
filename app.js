const API_URL = "https://script.google.com/macros/s/AKfycbz31-fSdLhAJrww-Z51zqnZrZnwkQLtnmhMav45KmW9SWa0b6wrGO8hs9TU8yUUVXxU9Q/exec";
let saldo = 0;
let totalMasuk = 0;
let totalKeluar = 0;

const form = document.getElementById("form");
const history = document.getElementById("history");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const jenis = document.getElementById("jenis").value;
    const kategori = document.getElementById("kategori").value;
    const nominal = Number(document.getElementById("nominal").value);
    const catatan = document.getElementById("catatan").value;

    if(!kategori || !nominal){
        alert("Lengkapi data terlebih dahulu.");
        return;
    }

    const tanggal = new Date().toLocaleDateString("id-ID");

    if(jenis=="Masuk"){
        saldo += nominal;
        totalMasuk += nominal;
    }else{
        saldo -= nominal;
        totalKeluar += nominal;
    }

    document.getElementById("saldo").innerHTML =
        "Rp " + saldo.toLocaleString("id-ID");

    document.getElementById("income").innerHTML =
        "Rp " + totalMasuk.toLocaleString("id-ID");

    document.getElementById("expense").innerHTML =
        "Rp " + totalKeluar.toLocaleString("id-ID");

    history.innerHTML =
`
<div class="item">
<div>
<b>${kategori}</b><br>
<small>${catatan}</small>
</div>

<div class="${jenis=="Masuk"?"masuk":"keluar"}">

${jenis=="Masuk"?"+":"-"}

Rp ${nominal.toLocaleString("id-ID")}

</div>

</div>
` + history.innerHTML;

    try{

        await fetch(API_URL,{
            method:"POST",
            body:JSON.stringify({
                tanggal,
                jenis,
                kategori,
                dompet:"Cash",
                nominal,
                catatan
            })
        });

    }catch(err){

        console.log(err);

    }

    form.reset();

    updateChart();

});

let chart;

function updateChart(){

    const ctx=document.getElementById("chart");

    if(chart){

        chart.destroy();

    }

    chart=new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:["Pemasukan","Pengeluaran"],

            datasets:[{

                data:[totalMasuk,totalKeluar]

            }]

        }

    });

}
