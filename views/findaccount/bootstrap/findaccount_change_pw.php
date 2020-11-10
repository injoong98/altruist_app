<?php $this->managelayout->add_css(element('view_skin_url', $layout) . '/css/style.css'); ?>

<style>
	footer,
	nav,
	header,
	.sidebar,
	.header_line {
		display: none !important;
	}

	@font-face {
		font-family: ng;
		src: url(assets\fonts\Jalnan.ttf);
		/* src: local(※), url(NanumGothic.woff) format('ttf') */
	}

	/* 
	.find-title {
		font-family: '잘난', 'Jalnan', ng;
	} */
	.find-button {
		align-items: flex-end;

		background-color: #6460A7;
		color: white;
		float: right
	}

	@media only screen and (max-width : 321px) {
		.find-title {
			/* font-family: '잘난', 'Jalnan', ng; */
			font-size: 2.3em;
		}

		.find-content {
			font-size: 2.3em;
		}

		#new_password {
			height: 3em;
		}

		#new_password_re {
			height: 3em;
		}
	}

	.row>div:first-child {
		width: 100% !important;
	}

	.main {
		margin: 0
	}

	.alert-custom {
		background-repeat: repeat-x !important;
		border-color: white !important;
		background-image: linear-gradient(to bottom, #C3BEDE 0, #938CBB 100%);
		color: white
	}
</style>


<?php
echo validation_errors('<div class="alert alert-warning" role="alert">', '</div>');
echo show_alert_message(element('error_message', $view), '<div class="alert alert-dismissible alert-warning"><button type="button" class="close alertclose" >&times;</button>', '</div>');
echo show_alert_message(element('success_message', $view), '<div class="alert alert-dismissible alert-info"><button type="button" class="close alertclose" >&times;</button>', '</div>');
if (!element('error_message', $view) && !element('success_message', $view)) {
	echo show_alert_message(element('info', $view), '<div class="alert alert-info alert-custom">', '</div>');
	$attributes = array('class' => 'form-horizontal', 'name' => 'fresetpw', 'id' => 'fresetpw');
	echo form_open(current_full_url(), $attributes);
?>
	<!-- <legend>패스워드 변경</legend> -->
	<!-- <p>회원님의 패스워드를 변경합니다.</p> -->
	<div class="form-group">
		<p class="col-lg-3">회원님의 아이디는 "</p>
		<label class="col-lg-3 find-title"> <?php echo element('mem_userid', $view); ?> </label>
		<p class="col-lg-3">" 입니다.</p>
	</div>
	<div class="form-group">
		<label class="col-lg-3 control-label find-title">새로운 패스워드</label>
		<div class="col-md-4">
			<input type="password" name="new_password" id="new_password" class="form-control col-lg-3" placeholder="새로운 패스워드를 입력해주세요" />
		</div>
	</div>
	<div class="form-group">
		<label class="col-lg-3 control-label find-title">새로운 패스워드(재입력)</label>
		<div class="col-md-4">
			<input type="password" name="new_password_re" id="new_password_re" class="form-control col-lg-3" placeholder="입력한 패스워드를 똑같이 입력해주세요" />
		</div>
	</div>
	<div class="form-group">
		<div class="col-md-4 col-lg-offset-3">
			<button type="submit" class="d-inline text-white btn btn-md find-button">패스워드 변경하기</button>
		</div>
	</div>
<?php
	echo form_close();
}
?>


<script type="text/javascript">
	//<![CDATA[
	$(function() {
		$('#fresetpw').validate({
			rules: {
				new_password: {
					required: true,
					minlength: <?php echo element('password_length', $view); ?>
				},
				new_password_re: {
					required: true,
					minlength: <?php echo element('password_length', $view); ?>,
					equalTo: '#new_password'
				}
			}
		});
	});
	//]]>
</script>