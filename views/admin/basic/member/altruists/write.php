<script type="text/javascript" src="http://dmaps.daum.net/map_js_init/postcode.v2.js"></script>
<div class="box">
	<div class="box-table">
		<?php
		echo validation_errors('<div class="alert alert-warning" role="alert">', '</div>');
		echo show_alert_message(element('message', $view), '<div class="alert alert-warning">', '</div>');
		$attributes = array('class' => 'form-horizontal', 'name' => 'fadminwrite', 'id' => 'fadminwrite');
		echo form_open_multipart(current_full_url(), $attributes);
		?>
			<input type="hidden" name="alt_id"	value="<?php echo element('alt_id', element('data', $view)); ?>" />
			<div class="form-group">
				<label class="col-sm-2 control-label">회원아이디</label>
				<div class="col-sm-10 form-inline">
				<span  class="form-control" style="border:none; -webkit-box-shadow:none;" >
					 <input type="hidden" class="form-control" name="alt_mem_id" value="<?php echo set_value('mem_id', element('mem_id', element('data', $view))); ?>" /> 
					<?php echo set_value('mem_userid', element('mem_userid', element('data', $view))); ?>
				</span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">회원이메일</label>
				<div class="col-sm-8">
				<span  class="form-control" style="border:none; -webkit-box-shadow:none;" >
					<!-- <input type="email" class="form-control" name="mem_email" value="<?php echo set_value('mem_email', element('mem_email', element('data', $view))); ?>" disabled /> -->
					<?php echo set_value('mem_email', element('mem_email', element('data', $view))); ?>
				</span>
				</div>
		
			</div>
			
			<div class="form-group">
				<label class="col-sm-2 control-label">회원실명</label>
				<div class="col-sm-10">
				<span  class="form-control" style="border:none; -webkit-box-shadow:none;" >
					<!-- <input type="text" class="form-control" name="mem_username" value="<?php echo set_value('mem_username', element('mem_username', element('data', $view))); ?>"  disabled/> -->
					<?php echo set_value('mem_username', element('mem_username', element('data', $view))); ?>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">닉네임</label>
				<div class="col-sm-10">
				<span  class="form-control" style="border:none; -webkit-box-shadow:none;" >
					<!-- <input type="text" class="form-control" name="mem_nickname" value="<?php echo set_value('mem_nickname', element('mem_nickname', element('data', $view))); ?>" disabled/> -->
					<?php echo set_value('mem_nickname', element('mem_nickname', element('data', $view))); ?>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">성별</label>
				<div class="col-sm-10">
					<div class="input-group">
						<input type="radio" name="mem_sex" value="1" <?php echo set_radio('mem_sex', '1', (element('mem_sex', element('data', $view)) === '1' ? true : false)); ?> disabled/> 남성
						<input type="radio" name="mem_sex" value="2" <?php echo set_radio('mem_sex', '2', (element('mem_sex', element('data', $view)) === '2' ? true : false)); ?> disabled/> 여성
					</div>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">타이틀</label>
				<div class="col-sm-10">
				<span  class="form-control" style="border:none; -webkit-box-shadow:none;" >
					<?php echo set_value('alt_title', element('alt_title', element('data', $view))); ?>
				</span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">자기한줄소개</label>
				<div class="col-sm-10">
				<span  class="form-control" style="border:none; -webkit-box-shadow:none;" >
					<?php echo set_value('alt_aboutme', element('alt_aboutme', element('data', $view))); ?>
				</span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">길줄 소개</label>
				<div class="col-sm-10">
				<span  class="form-control" style="border:none; -webkit-box-shadow:none;" >
					<?php echo set_value('alt_content', element('alt_content', element('data', $view))); ?>
				</span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">질문받는 타입 </label>
				<div class="col-sm-10">
				<span  class="form-control" style="border:none; -webkit-box-shadow:none;" >
					<?php echo set_value('alt_answertype', element('alt_answertype', element('data', $view))); ?>
				</span>
				</div>
			</div>
			
			
			<div class="form-group">
				<label class="col-sm-2 control-label">전문영역</label>
				<div class="col-sm-10">
					<?php
					if (element('alt_cat', element('data', $view))) {
						foreach (element('alt_cat', element('data', $view)) as $gkey => $gval) {
							$chkvalue = is_array(element('alt_area', element('data', $view))) && in_array(element('act_id', $gval), element('alt_area', element('data', $view))) ? element('act_id', $gval) : '';
					?>
						<label for="alt_area_<?php echo element('act_id', $gval); ?>" class="checkbox-inline">
							<input type="checkbox" name="alt_area[]"  value="" <?php echo set_checkbox('alt_area[]', element('act_id', $alt_area), ($chkvalue ? true : false)); ?> /> <?php echo element('act_content', $gval); ?>
						</label>
					<?php
						}
					}
					?>
				</div>
			</div>
			
		
			<div class="collapse in" id="cmalltab17">
				<div class="form-group">
					<label class="col-sm-2 control-label">경력사항</label>
					<div class="col-sm-10 form-inline">
					<!-- 	<p><a href="javascript:;" class="btn btn-xs btn-danger" onClick="add_option();">경력 추가</a><br /></p> -->
						<div class="table-responsive">
							<table class="table table-hover table-striped table-bordered">
								<thead>
									<tr>
										
										<th style="width:100px;">공개 </th>
										<th style="width:100px;">구분</th>
										<th style="width:100px;">년도</th>
										<th style="width:350px;">경력</th>
										<th style="width:100px;">첨부</th>
										<th style="width:100px;">최종</th>
										<th style="width:100px;">인증</th>
									</tr>
								</thead>
								<tbody id="item_option_wrap">
									<?php
									if (element('alt_cv', element('data', $view))) {
										foreach (element('alt_cv', element('data', $view)) as $alt_cv) {
											?>
											<tr>
												<input type="hidden" name="acv_id_update[<?php echo html_escape(element('acv_id', $alt_cv)); ?>]" value="<?php echo html_escape(element('acv_id', $alt_cv)); ?>" /></td> <!-- 키 -->
												<td><input type="hidden" name="acv_status_org[<?php echo html_escape(element('acv_id', $alt_cv)); ?>]" value="<?php echo (element('acv_status', $alt_cv))?>" />
												<input type="checkbox" name="acv_open_update[<?php echo html_escape(element('acv_id', $alt_cv)); ?>]" value="1" <?php echo (element('acv_open', $alt_cv)) ? ' checked="checked" ' : ''; ?> /> <!-- 공개 -->
												</td> <!-- 공개 -->
												<td><?php echo html_escape(element('acv_type', $alt_cv)); ?></td> <!-- 타입 -->
												<td><?php echo html_escape(element('acv_year', $alt_cv)); ?></td> <!-- 년도 -->
												<td><p><?php echo html_escape(element('acv_content', $alt_cv)); ?></p></td> <!-- 경력 -->
												<td><a href="<?php echo site_url(element('acv_file1', $alt_cv)); ?>" target="_blank">다운로드</a> </td> <!-- 첨부파일 -->
											
												<td><?php echo html_escape(element('acv_final', $alt_cv)); ?></td> <!-- 최종여부 -->
												
												<td><input type="checkbox" name="acv_status_update[<?php echo html_escape(element('acv_id', $alt_cv)); ?>]" value="1" <?php echo (element('acv_status', $alt_cv)) ? ' checked="checked" ' : ''; ?> /></td> <!-- 인증 -->

											</tr>
									<?php
										}
									}
									?>
								</tbody>
							</table>
						</div>

					</div>
				</div>
			</div>
			<!-- 경력 사항 끝 -->
			<div class="form-group">
				<label class="col-sm-2 control-label">평점</label>
				<div class="col-sm-10">
					<input type="text" class="form-control" name="alt_score" value="<?php echo set_value('alt_score', element('alt_score', element('data', $view))); ?>" />
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">명예 여부</label>
				<div class="col-sm-10">
					<input type="text" class="form-control" name="alt_honor" value="<?php echo set_value('alt_honor', element('alt_honor', element('data', $view))); ?>" />
					
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">이타주의자 프로필 사진</label>
				<div class="col-sm-10">
					<img src="<?php echo element('profile_thumb_url', element('data', $view)); ?>" alt="<?php echo element('profile_thumb_url', element('data', $view)); ?>" title="" class="thumbnail mg0 view_full_image" style="width:80px;cursor:pointer;" data-origin-image-url="" />
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">신청일자</label></label>
				<div class="col-sm-10">
				<span  class="form-control" style="border:none; -webkit-box-shadow:none;" >
					<?php echo set_value('alt_datetime', element('alt_datetime', element('data', $view))); ?>
				</span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">승인일자</label>
				<div class="col-sm-10">
				<span  class="form-control" style="border:none; -webkit-box-shadow:none;" >
					<?php echo set_value('alt_approve_datetime', element('alt_approve_datetime', element('data', $view))); ?>
				</span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">승인상태</label>
				<div class="col-sm-10 form-inline">
				<input type="hidden" class="form-control" name="alt_status_org" value="<?php echo element('alt_status', element('data', $view)); ?>" />
					<select name="alt_status" class="form-control">
						<option value="R" <?php echo set_select('alt_status', 'R', ( element('alt_status', element('data', $view))=='R') ? true : false); ?>>대기</option>
						<option value="Y" <?php echo set_select('alt_status', 'Y', ( element('alt_status', element('data', $view)) =='Y') ? true : false); ?>>승인</option>
						<option value="J" <?php echo set_select('alt_status', 'J', ( element('alt_status', element('data', $view))=='J') ? true : false); ?>>거절</option>
					</select>
				</div>
			</div>				

			<div class="btn-group pull-right" role="group" aria-label="...">
				<button type="button" class="btn btn-default btn-sm btn-history-back" >취소하기</button>
				<button type="submit" class="btn btn-success btn-sm">저장하기</button>
			</div>
		<?php echo form_close(); ?>
	</div>
</div>

<script type="text/javascript">
//<![CDATA[
$(function() {
	$('#fadminwrite').validate({
		rules: {
			mem_userid: { required: true, minlength:3, maxlength:20 },
			mem_username: {minlength:2, maxlength:20 },
			mem_nickname: {required :true, minlength:2, maxlength:20 },
			mem_email: {required :true, email:true },
			mem_password: {minlength :4 }
		}
	});
});
//]]>
</script>
