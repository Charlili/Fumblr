<?php

require_once WWW_ROOT . 'dao' . DIRECTORY_SEPARATOR . 'DAO.php';

class PostsDAO extends DAO {
    
	public function selectAll() {
		$sql = "SELECT * 
						FROM `IN_posts`";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}    

	public function selectById($id) {
		$sql = "SELECT * 
						FROM `IN_posts` 
						WHERE `id` = :id";
		$stmt = $this->pdo->prepare($sql);
		$stmt->bindValue(':id', $id);
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		if($result){
			return $result;
		}
		return [];
	}
	public function selectByUserId($id) {
		$sql = "SELECT * 
						FROM `IN_posts` 
						WHERE `user_id` = :id";
		$stmt = $this->pdo->prepare($sql);
		$stmt->bindValue(':id', $id);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if($result){
			return $result;
		}
		return [];
	}

	public function delete($id) {
		$sql = "DELETE 
						FROM `IN_posts` 
						WHERE `id` = :id";
		$stmt = $this->pdo->prepare($sql);
		$stmt->bindValue(':id', $id);
		return $stmt->execute();
	}

	public function insert($data) {
		$errors = $this->getValidationErrors($data);
		if(empty($errors)) {
			$sql = "INSERT INTO `IN_posts` (`user_id`,`type`, `description`, `content`,`author`) 
							VALUES (:user_id, :type, :description, :content, :author)";
			$stmt = $this->pdo->prepare($sql);
			$stmt->bindValue(':type', $data['type']);
			$stmt->bindValue(':user_id', $data['user_id']);
			$stmt->bindValue(':description', $data['description']);
			$stmt->bindValue(':content', $data['content']);
			$stmt->bindValue(':author', $data['author']);
			if($stmt->execute()) {
				$insertedId = $this->pdo->lastInsertId();
				return $this->selectById($insertedId);
			}
		}
		return false;
	}

	public function getValidationErrors($data) {
		$errors = array();
		if(empty($data['type'])) {
			$errors['type'] = 'field type has no value';
		}
		if(empty($data['description'])) {
			$errors['description'] = 'field description has no value';
		}
		if(empty($data['content'])) {
			$errors['content'] = 'field content has no value';
		}
		if(empty($data['user_id'])) {
			$errors['user_id'] = 'field user_id has no value';
		}
		return $errors;
	}

}