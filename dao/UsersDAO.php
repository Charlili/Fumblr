<?php

require_once WWW_ROOT . 'dao' . DIRECTORY_SEPARATOR . 'DAO.php';

class UsersDAO extends DAO {
    
	public function selectAll() {
    	$sql = "SELECT * 
    					FROM `IN_users`";
    	$stmt = $this->pdo->prepare($sql);
    	$stmt->execute();
    	return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}    

	public function selectById($id) {
		$sql = "SELECT * 
						FROM `IN_users` 
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

	public function selectByEmail($email) {
		$sql = "SELECT * 
						FROM `IN_users` 
						WHERE `email` = :email";
		$stmt = $this->pdo->prepare($sql);
		$stmt->bindValue(':email', $email);
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		if($result){
			return $result;
		}
		return [];
	}

	public function delete($id) {
		$sql = "DELETE 
						FROM `IN_users` 
						WHERE `id` = :id";
		$stmt = $this->pdo->prepare($sql);
		$stmt->bindValue(':id', $id);
		return $stmt->execute();
	}

	public function update($id, $data) {
		$errors = $this->getValidationErrors($data);
		if(empty($errors)) {
			$sql = "UPDATE `IN_users` 
							SET `password` = :password,
								`extension` = :extension
							WHERE `id` = :id";
			$stmt = $this->pdo->prepare($sql);
			$stmt->bindValue(':password', $data['password']);
			$stmt->bindValue(':extension', $data['extension']);
			$stmt->bindValue(':id', $id);
			if($stmt->execute()) {
				return $this->selectById($id);
			}
		}
		return false;
	}	

	public function insert($data) {
		$errors = $this->getValidationErrors($data);
		if(empty($errors)) {
			$sql = "INSERT INTO `IN_users` (`email`, `password`, `username`, `extension`) 
							VALUES (:email, :password, :username, :extension)";
			$stmt = $this->pdo->prepare($sql);
			$stmt->bindValue(':email', $data['email']);
			$stmt->bindValue(':password', $data['password']);
			$stmt->bindValue(':username', $data['username']);
			$stmt->bindValue(':extension', $data['extension']);
			if($stmt->execute()) {
				$insertedId = $this->pdo->lastInsertId();
				return $this->selectById($insertedId);
			}
		}
		return false;
	}

	public function getValidationErrors($data) {
		$errors = array();
		
		if(empty($data['email'])) {
			$errors['email'] = 'field email has no value';
		}
		if(empty($data['password'])) {
			$errors['password'] = 'field password has no value';
		}
		if(empty($data['username'])) {
			$errors['username'] = 'field username has no value';
		}
		if(empty($data['extension'])) {
			$errors['extension'] = 'field extension has no value';
		}
		return $errors;
	}

}