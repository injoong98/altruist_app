<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Gpoint model class
 *
 * Copyright (c) CIBoard <www.ciboard.co.kr>
 *
 * @author CIBoard (develop@ciboard.co.kr)
 */

class Gpoint_model extends CB_Model
{

	/**
	 * 테이블명
	 */
	public $_table = 'gpoint';

	/**
	 * 사용되는 테이블의 프라이머리키
	 */
	public $primary_key = 'gam_id'; // 사용되는 테이블의 프라이머리키

	function __construct()
	{
		parent::__construct();
	}


	public function get_admin_list($limit = '', $offset = '', $where = '', $like = '', $findex = '', $forder = '', $sfield = '', $skeyword = '', $sop = 'OR')
	{
		$select = 'gpoint.*, member.mem_userid, member.mem_nickname, member.mem_is_admin, member.mem_icon, member.mem_gpoint';
		$join[] = array('table' => 'member', 'on' => 'gpoint.mem_id = member.mem_id', 'type' => 'left');
		$result = $this->_get_list_common($select, $join, $limit, $offset, $where, $like, $findex, $forder, $sfield, $skeyword, $sop);

		return $result;
	}


	public function get_gpoint_sum($mem_id = 0)
	{
		$mem_id = (int) $mem_id;
		if (empty($mem_id) OR $mem_id < 1) {
			return 0;
		}

		$this->db->select_sum('gam_point');
		$this->db->where(array('mem_id' => $mem_id));
		$result = $this->db->get('gpoint');
		$result = $result->row_array();

		return $result['gam_point'];
	}
	public function ranking_list($gam_type = 'trex')
	{
		/* SELECT gp.*, member.mem_nickname nickname, member.mem_photo photo FROM cb_gpoint gp 
		LEFT JOIN cb_member member ON gp.mem_id = member.mem_id */
		
		$this->db->select('gpoint.*, member.mem_nickname nickname, member.mem_photo photo');
		$this->db->join('member', 'gpoint.mem_id = member.mem_id', 'inner');
		$this->db->where('member.mem_denied', 0);
		//$this->db->where('member.mem_is_admin', 0);
		$this->db->where('gam_point >', 0);
		$this->db->where('gam_type =', $gam_type);
		/* $this->db->group_by('member.mem_id'); */
		$this->db->order_by('gam_point', 'DESC');
		/* $this->db->limit($limit); */
		$qry = $this->db->get('gpoint');
		$result = $qry->result_array();

		return $result;

	}


	public function point_ranking_all($limit = '')
	{
		if (empty($limit)) {
			$limit = 100;
		}
		$this->db->select_sum('gam_point');
		$this->db->select('member.mem_id, member.mem_userid, member.mem_nickname, member.mem_is_admin, member.mem_icon');
		$this->db->join('member', 'gpoint.mem_id = member.mem_id', 'inner');
		$this->db->where('member.mem_denied', 0);
		//$this->db->where('member.mem_is_admin', 0);
		$this->db->where('gam_point >', 0);
		$this->db->group_by('member.mem_id');
		$this->db->order_by('gam_point', 'DESC');
		$this->db->limit($limit);
		$qry = $this->db->get('gpoint');
		$result = $qry->result_array();

		return $result;
	}


	public function point_ranking_month($year = 0, $month = 0, $limit = 0)
	{
		$year = (int) $year;
		if ($year<1000 OR $year > 2999) {
			$year = cdate('Y');
		}

		$month = (int) $month;
		if ($month < 1 OR $month > 12) {
			$month = (int) cdate('m');
		}
		$month = sprintf("%02d", $month);

		$start_datetime = $year . '-' . $month . '-01 00:00:00';
		$end_datetime = $year . '-' . $month . '-31 23:59:59';

		if (empty($limit)) {
			$limit = 100;
		}

		$this->db->select_sum('gam_point');
		$this->db->select('member.mem_id, member.mem_userid, member.mem_nickname, member.mem_is_admin, member.mem_icon');
		$this->db->join('member', 'gpoint.mem_id = member.mem_id', 'inner');
		$this->db->where('member.mem_denied', 0);
		$this->db->where('member.mem_is_admin', 0);
		$this->db->where('gpoint.gam_datetime >=', $start_datetime);
		$this->db->where('gpoint.gam_datetime <=', $end_datetime);
		$this->db->where('gam_point >', 0);
		$this->db->group_by('member.mem_id');
		$this->db->order_by('gam_point', 'DESC');
		$this->db->limit($limit);
		$qry = $this->db->get('gpoint');
		$result = $qry->result_array();

		return $result;
	}


	public function member_count_by_point_count($point_count = 10, $datetime = '')
	{
		if (empty($datetime)) {
			$datetime = ctimestamp() - 30 * 24 * 60 * 60;
		}
		$this->db->select('count(*) as cnt');
		$this->db->where('gam_datetime <=', $datetime);
		$this->db->group_by('mem_id');
		$this->db->having('cnt >', $point_count);
		$qry = $this->db->get('gpoint');
		$result = $qry->result_array();

		return $result;
	}

	public function get_highscore($gam_type='trex')
	{
		$this->db->select('MAX(gam_point) score');
		$this->db->where('gam_type =', $gam_type);
		$qry = $this->db->get('gpoint');

		foreach ($qry->result() as $row)
		{
			$result = $row->score;
		}
		return $result;
	}


	public function member_list_by_point_count($point_count = 10, $datetime = '')
	{
		if (empty($datetime)) {
			$datetime = ctimestamp() - 30 * 24 * 60 * 60;
		}
		$this->db->select('mem_id, count(*) as cnt, sum(gam_point) as sum_point');
		$this->db->where('gam_datetime <=', $datetime);
		$this->db->group_by('mem_id');
		$this->db->having('cnt >', $point_count);
		$this->db->order_by('cnt', 'DESC');
		$this->db->limit(100);
		$qry = $this->db->get('gpoint');
		$result = $qry->result_array();

		return $result;
	}
}
