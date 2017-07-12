<?php 

echo "Resultados para subir a DB";

$tipodereporte = $_POST["nameradio"];
$nombre = $_POST["namenombre"];
$probabilidad = $_POST["nameprobabilidad"];
$severidad = $_POST["nameseveridad"];
$reporte = $_POST["namereporte"];
$plan = $_POST["nameplan"];

?><br>

<p>Tipo de reporte: <?php echo $tipodereporte; ?></p>
<p>Reportado por: <?php echo $nombre; ?></p>
<p>Probabilidad: <?php echo $probabilidad; ?></p>
<p>Severidad: <?php echo $severidad; ?></p>
<p>Reporte: <?php echo $reporte; ?></p>
<p>Plan de acción: <?php echo $plan; ?></p>