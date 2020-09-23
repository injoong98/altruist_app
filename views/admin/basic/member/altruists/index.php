<div class="box">
	<div class="box-table">
		<?php
		echo show_alert_message($this->session->flashdata('message'), '<div class="alert alert-auto-close alert-dismissible alert-info"><button type="button" class="close alertclose" >&times;</button>', '</div>');
		$attributes = array('class' => 'form-inline', 'name' => 'flist', 'id' => 'flist');
		echo form_open(current_full_url(), $attributes);
		?>
			<div class="box-table-header">
				<div class="btn-group btn-group-sm" role="group">
					<a href="?" class="btn btn-sm <?php echo ( ! $this->input->get('mem_is_admin') && ! $this->input->get('mem_denied')) ? 'btn-success' : 'btn-default'; ?>">전체</a>
					<a href="?alt_status=Y" class="btn btn-sm <?php echo ($this->input->get('mem_is_admin')) ? 'btn-success' : 'btn-default'; ?>">승인</a>
					<a href="?alt_status=R" class="btn btn-sm <?php echo ($this->input->get('mem_denied')) ? 'btn-success' : 'btn-default'; ?>">대기</a>
					<a href="?alt_status=J" class="btn btn-sm <?php echo ($this->input->get('mem_denied')) ? 'btn-success' : 'btn-default'; ?>">거부</a>
				</div>
				<div class="btn-group btn-group-sm" role="group">
					<a href="?" class="btn btn-sm <?php echo ( ! $this->input->get('mgr_id')) ? 'btn-success' : 'btn-default'; ?>">전체그룹</a>
					<?php
					foreach (element('all_group', $view) as $gkey => $gval) {
					?>
						<a href="?mgr_id=<?php echo element('mgr_id', $gval); ?>" class="btn btn-sm <?php echo (element('mgr_id', $gval) === $this->input->get('mgr_id')) ? 'btn-success' : 'btn-default'; ?>"><?php echo element('mgr_title', $gval); ?></a>
					<?php
					}
					?>
				</div>
				<?php
				ob_start();
				?>
					<div class="btn-group pull-right" role="group" aria-label="...">
						<button type="button" class="btn btn-outline btn-success btn-sm" id="export_to_excel"><i class="fa fa-file-excel-o"></i> 엑셀 다운로드</button>
						<a href="<?php echo element('listall_url', $view); ?>" class="btn btn-outline btn-default btn-sm">전체목록</a>
						<button type="button" class="btn btn-outline btn-default btn-sm btn-list-delete btn-list-selected disabled" data-list-delete-url = "<?php echo element('list_delete_url', $view); ?>" >선택삭제</button>
						<a href="<?php echo element('write_url', $view); ?>" class="btn btn-outline btn-danger btn-sm">회원추가</a>
					</div>
				<?php
				$buttons = ob_get_contents();
				ob_end_flush();
				?>
			</div>
			<div class="row">전체 : <?php echo element('total_rows', element('data', $view), 0); ?>건</div>
			<div class="table-responsive">
				<table class="table table-hover table-striped table-bordered">
					<thead>
						<tr>
							<th><a href="<?php echo element('mem_id', element('sort', $view)); ?>">번호</a></th>
							<th><a href="<?php echo element('mem_userid', element('sort', $view)); ?>">아이디</a></th>
							<th><a href="<?php echo element('mem_username', element('sort', $view)); ?>">실명</a></th>
							<th><a href="<?php echo element('mem_nickname', element('sort', $view)); ?>">닉네임</a></th>
							<th><a href="<?php echo element('mem_email', element('sort', $view)); ?>">이메일</a></th>
							<th><a href="<?php echo element('alt_answertype', element('sort', $view)); ?>">답변구분</a></th>
							<th><a href="<?php echo element('alt_score', element('sort', $view)); ?>">평점</a></th>
							<th><a href="<?php echo element('alt_datetime', element('sort', $view)); ?>">신청일</a></th>
							<th>승인</th>
							<th>승인날짜</th>
							<th>상세</th>
							<th><input type="checkbox" name="chkall" id="chkall" /></th>
						</tr>
					</thead>
					<tbody>
					<?php
					if (element('list', element('data', $view))) {
						foreach (element('list', element('data', $view)) as $result) {
					?>
						<tr>
							<td><?php echo number_format(element('num', $result)); ?></td>
							<td><?php echo html_escape(element('mem_userid', $result)); ?></td>
							<td>
								<span><?php echo html_escape(element('mem_username', $result)); ?></span>
								<?php echo element('mem_is_admin', $result) ? '<span class="label label-primary">최고관리자</span>' : ''; ?>
								<?php echo element('mem_denied', $result) ? '<span class="label label-danger">차단</span>' : ''; ?>
							</td>
							<td><?php echo element('display_name', $result); ?></td>
							<td><?php echo html_escape(element('mem_email', $result)); ?></td>
							<td><?php echo element('alt_answertype', $result); ?></td>
							<td><?php echo number_format(element('alt_score', $result)); ?></td>
							<td><?php echo display_datetime(element('alt_datetime', $result), 'full'); ?></td>
						<!-- 	<td><?php echo element('alt_status', $result) ? '<span class="label label-danger">차단</span>' : '승인'; ?></td> -->
							<td><?php echo element('alt_status', $result); ?></td>
							<td><?php echo display_datetime(element('alt_approve_datetime', $result), 'full'); ?></td>
							<td><a href="<?php echo admin_url($this->pagedir); ?>/write/<?php echo element(element('primary_key', $view), $result); ?>?<?php echo $this->input->server('QUERY_STRING', null, ''); ?>" class="btn btn-outline btn-default btn-xs">상세보기</a></td>
							<td><input type="checkbox" name="chk[]" class="list-chkbox" value="<?php echo element(element('primary_key', $view), $result); ?>" /></td>
						</tr>
					<?php
						}
					}
					if ( ! element('list', element('data', $view))) {
					?>
						<tr>
							<td colspan="17" class="nopost">자료가 없습니다</td>
						</tr>
					<?php
					}
					?>
					</tbody>
				</table>
			</div>
			<div class="box-info">
				<?php echo element('paging', $view); ?>
				<div class="pull-left ml20"><?php echo admin_listnum_selectbox();?></div>
				<?php echo $buttons; ?>
			</div>
		<?php echo form_close(); ?>
	</div>
	<form name="fsearch" id="fsearch" action="<?php echo current_full_url(); ?>" method="get">
		<div class="box-search">
			<div class="row">
				<div class="col-md-6 col-md-offset-3">
					<select class="form-control" name="sfield" >
						<?php echo element('search_option', $view); ?>
					</select>
					<div class="input-group">
						<input type="text" class="form-control" name="skeyword" value="<?php echo html_escape(element('skeyword', $view)); ?>" placeholder="Search for..." />
						<span class="input-group-btn">
							<button class="btn btn-default btn-sm" name="search_submit" type="submit">검색!</button>
						</span>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>

<script type="text/javascript">
//<![CDATA[
function social_open(stype, mem_id) {
	var pop_url = cb_admin_url + '/member/altruists/socialinfo/' + stype + '/' + mem_id;
	window.open(pop_url, 'win_socialinfo', 'left=100,top=100,width=730,height=500,scrollbars=1');
	return false;
}

$(document).on('click', '#export_to_excel', function(){
	exporturl = '<?php echo admin_url($this->pagedir . '/excel' . '?' . $this->input->server('QUERY_STRING', null, '')); ?>';
	document.location.href = exporturl;
})

//]]>
</script>
