<?php

$dir = __DIR__ . '/database/migrations';
$files = scandir($dir);

$migrations = [
    'create_roles_table' => <<<PHP
            \$table->id();
            \$table->string('role_name');
            \$table->timestamps();
PHP,
    'create_planning_budgetings_table' => <<<PHP
            \$table->id();
            \$table->string('title')->nullable();
            \$table->text('description')->nullable();
            \$table->string('period')->nullable();
            \$table->bigInteger('amount')->nullable()->default(0);
            \$table->string('status')->nullable();
            \$table->timestamps();
            \$table->softDeletes();
PHP,
    'create_monthly_budgets_table' => <<<PHP
            \$table->id();
            \$table->string('month_year')->nullable();
            \$table->string('category')->nullable();
            \$table->bigInteger('budget')->nullable()->default(0);
            \$table->bigInteger('realization')->nullable()->default(0);
            \$table->text('notes')->nullable();
            \$table->timestamps();
PHP,
    'create_investment_budgets_table' => <<<PHP
            \$table->id();
            \$table->string('project_name')->nullable();
            \$table->string('year')->nullable();
            \$table->bigInteger('budget')->nullable()->default(0);
            \$table->integer('progress')->nullable()->default(0);
            \$table->timestamps();
PHP,
    'create_lgpps_table' => <<<PHP
            \$table->id();
            \$table->string('title')->nullable();
            \$table->string('period')->nullable();
            \$table->text('details')->nullable();
            \$table->timestamps();
PHP,
    'create_rkhps_table' => <<<PHP
            \$table->id();
            \$table->string('year')->nullable();
            \$table->string('program_name')->nullable();
            \$table->bigInteger('estimated_budget')->nullable()->default(0);
            \$table->timestamps();
PHP,
    'create_monthly_reports_table' => <<<PHP
            \$table->id();
            \$table->string('title')->nullable();
            \$table->string('month_year')->nullable();
            \$table->unsignedBigInteger('user_id')->nullable();
            \$table->string('file_path')->nullable();
            \$table->string('status')->nullable()->default('Pending');
            \$table->timestamps();
PHP,
    'create_operational_materials_table' => <<<PHP
            \$table->id();
            \$table->string('material_code')->nullable()->index();
            \$table->string('material_name')->nullable();
            \$table->string('category')->nullable();
            \$table->integer('quantity')->nullable()->default(0);
            \$table->string('unit')->nullable();
            \$table->string('location')->nullable();
            \$table->bigInteger('unit_price')->nullable()->default(0);
            \$table->bigInteger('total_value')->nullable()->default(0);
            \$table->timestamps();
PHP,
    'create_material_transactions_table' => <<<PHP
            \$table->id();
            \$table->date('transaction_date')->nullable();
            \$table->string('material_code')->nullable()->index();
            \$table->string('transaction_type')->nullable();
            \$table->integer('quantity_in')->nullable()->default(0);
            \$table->integer('quantity_out')->nullable()->default(0);
            \$table->integer('beginning_balance')->nullable()->default(0);
            \$table->integer('ending_balance')->nullable()->default(0);
            \$table->timestamps();
PHP,
    'create_non_routine_contracts_table' => <<<PHP
            \$table->id();
            \$table->string('contract_number')->nullable();
            \$table->string('vendor_name')->nullable();
            \$table->string('job_description')->nullable();
            \$table->bigInteger('contract_value')->nullable()->default(0);
            \$table->date('start_date')->nullable();
            \$table->date('end_date')->nullable();
            \$table->string('status')->nullable();
            \$table->timestamps();
PHP,
    'create_employees_table' => <<<PHP
            \$table->id();
            \$table->string('employee_id')->nullable()->index();
            \$table->string('name')->nullable();
            \$table->string('gender')->nullable();
            \$table->integer('age')->nullable();
            \$table->string('position')->nullable();
            \$table->string('department')->nullable();
            \$table->string('status')->nullable();
            \$table->timestamps();
            \$table->softDeletes();
PHP,
    'create_asset_categories_table' => <<<PHP
            \$table->id();
            \$table->string('category_name');
            \$table->timestamps();
PHP,
    'create_calendar_comments_table' => <<<PHP
            \$table->id();
            \$table->unsignedBigInteger('calendar_event_id')->nullable();
            \$table->unsignedBigInteger('user_id')->nullable();
            \$table->text('comment');
            \$table->timestamps();
PHP,
    'create_report_reviews_table' => <<<PHP
            \$table->id();
            \$table->unsignedBigInteger('monthly_report_id')->nullable();
            \$table->unsignedBigInteger('user_id')->nullable();
            \$table->text('review_notes');
            \$table->string('status')->nullable();
            \$table->timestamps();
PHP,
    'create_notifications_table' => <<<PHP
            \$table->id();
            \$table->unsignedBigInteger('user_id')->nullable();
            \$table->string('title')->nullable();
            \$table->text('message')->nullable();
            \$table->boolean('is_read')->default(false);
            \$table->timestamps();
PHP,
    'create_audit_logs_table' => <<<PHP
            \$table->id();
            \$table->unsignedBigInteger('user_id')->nullable();
            \$table->string('action')->nullable();
            \$table->string('model')->nullable();
            \$table->unsignedBigInteger('model_id')->nullable();
            \$table->json('changes')->nullable();
            \$table->timestamps();
PHP,
];

foreach ($files as $file) {
    if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
        foreach ($migrations as $key => $schema) {
            if (strpos($file, $key) !== false) {
                $content = file_get_contents($dir . '/' . $file);
                
                $content = preg_replace_callback('/(Schema::create\([\'"][^\'"]+[\'"],\s*function\s*\(Blueprint\s*\$table\)\s*\{)(.+?)(\}\);)/s', function($matches) use ($schema) {
                    return $matches[1] . "\n" . $schema . "\n        " . $matches[3];
                }, $content);
                
                file_put_contents($dir . '/' . $file, $content);
                echo "Updated " . $file . "\n";
            }
        }
    }
}

// Alter users table
$alterUsersMigration = <<<PHP
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint \$table) {
            if (!Schema::hasColumn('users', 'role_id')) {
                \$table->unsignedBigInteger('role_id')->nullable()->after('password');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint \$table) {
            if (Schema::hasColumn('users', 'role_id')) {
                \$table->dropColumn('role_id');
            }
        });
    }
};
PHP;

file_put_contents($dir . '/' . date('Y_m_d_His') . '_alter_users_table_add_role_id.php', $alterUsersMigration);
echo "Created alter_users_table_add_role_id.php\n";
