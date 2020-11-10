<style>
	@font-face {
		font-family: ng;
		src: url(assets\fonts\Jalnan.ttf);
		/* src: local(※), url(NanumGothic.woff) format('ttf') */
	}

	footer,
	nav,
	header,
	.sidebar,
	.header_line {
		display: none !important;
	}
</style>
<div style="font-family:none; text-align:center; font-size:2em">
	<?php echo element('message', $view); ?>
</div>
<!-- <div class="final col-md-12 col-md-offset-3">
	<div class="panel panel-default">
		<div style="font-family:'잘난', 'Jalnan', ng; text-align:center; margin : auto 0; font-size: 3em;">이메일 인증</div>
		<div class="panel-heading" style="font-family:'잘난', 'Jalnan', ng; text-align:center">이메일 인증</div>
		<div class="panel-body">
			<p style="margin: auto 0 ">
				
			</p>
		</div>
	</div>
</div> -->